from django.shortcuts import render, redirect
from django.template import loader
from django.http import HttpResponse, JsonResponse

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout


import re

import json

import arrow
import time

from couchdb import Server
import couchdb

SERVER = Server('http://127.0.0.1:5984/')
amount_of_sales = 0

def percentage(part, whole):
	return 100 * float(part)/float(whole)

def get_notification_data():
	db = SERVER['aio_flipper_accounts']

	accounts = []
	notifications = []

	for doc_id in db.view('accountsDesignDoc/getAllAccounts'):
		accounts.append(db[str(doc_id['id'])])

	for account in accounts:
		time_remaining = arrow.get(account['memberUntil'].split('.')[0].replace('T', ' '), 'YYYY-MM-DD HH:mm:ss') - arrow.get(arrow.now().format('YYYY-MM-DD HH:mm:ss'))
		time_remaining_48h = arrow.get(arrow.now().shift(days=+2).format('YYYY-MM-DD HH:mm:ss')) - arrow.get(arrow.now().format('YYYY-MM-DD HH:mm:ss'))
		
		if time_remaining <= time_remaining_48h:
			notifications.append({'username': account['username'], 'timeRemaining': time_remaining})

	return notifications

def login_view(request):
	if request.method == 'GET':
		context = {}
		template = loader.get_template('webapp/login.html')
		return HttpResponse(template.render(context, request))

	elif request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username=username, password=password)
		if user is not None:
			print "Logging in user..."
			login(request, user)
			print "Successfully logged in user"
			# Redirect to a success page.
			try:
				if request.GET['next']:
					return redirect(request.GET['next'])
				else:
					return redirect('/')

			except Exception as e:
				return redirect('/')

		else:
			print "Failed to log in user"
			# Return an 'invalid login' error message.
			return redirect('/login/')

def logout_view(request):
	logout(request)
	return redirect('/login/')

@login_required
def index(request):
	notification_data = get_notification_data()
	context = {'notification_data': notification_data}
	template = loader.get_template('webapp/index.html')
	return HttpResponse(template.render(context, request))

@login_required
def items(request):
	# Get the item data
	db = SERVER['aio_flipper_items']
	items = []

	for doc_id in db.view('itemsDesignDoc/getAllItems'):
		print doc_id['id']
		items.append(db[str(doc_id['id'])])
    
	for item in items:
		item['margin'] = item['currentSellPrice'] - item['currentBuyPrice']


	# Get the accounts to collect last bought data
	db = SERVER['aio_flipper_accounts']

	accounts = []

	for doc_id in db.view('accountsDesignDoc/getAllAccounts'):
		accounts.append(db[str(doc_id['id'])])

	for account in accounts:
		for item_last_bought in account['lastItemBuys']:
			for item in items:
				if item['name'] == item_last_bought.split(';')[0]:
					if 'lastBought' in item:
						if item['lastBought'] < item_last_bought.split(';')[1]:
							item['lastBought'] = item_last_bought.split(';')[1]
					else:
						item['lastBought'] = item_last_bought.split(';')[1]

	context = {
		'items': items,
	}

	template = loader.get_template('webapp/items.html')
	return HttpResponse(template.render(context, request))

@login_required
def accounts(request):
	db = SERVER['aio_flipper_accounts']

	accounts = []

	for doc_id in db.view('accountsDesignDoc/getAllAccounts'):
		accounts.append(db[str(doc_id['id'])])

	# Get items
	db = SERVER['aio_flipper_items']
	items = []

	for doc_id in db.view('itemsDesignDoc/getAllItems'):
		print doc_id['id']
		items.append(db[str(doc_id['id'])])

	# Slot images
	for account in accounts:
		# Total value progress bar
		account['totalValueGoalProgress'] = "%.0f" % percentage(account['totalValue'], 500000000)
		# Member until formatting
		account['memberUntilDate'] = account['memberUntil'].split('T')[0]
		account['memberUntilTime'] = account['memberUntil'].split('T')[1].split('.')[0]

		for slot in account['slots']:
			for item in items:

				if item['name'] == slot['itemName']:

					temp_str = item['itemImageUrl'].replace('\\', '/')
					temp_str_split = temp_str.split('AIOFlipper/')[1]

					item['staticImageUrl'] = temp_str_split
					slot['item'] = item

					break

	context = {
		'accounts': accounts,
	}
	template = loader.get_template('webapp/accounts.html')
	return HttpResponse(template.render(context, request))

@login_required
def json_scatter_sales_data(request):
	# Get the items to index them
	db = SERVER['aio_flipper_items']
	items = []

	for doc_id in db.view('itemsDesignDoc/getAllItems'):
		items.append(db[str(doc_id['id'])])

	i = 1
	for item in items:
		item['i'] = i
		i+=1

	db = SERVER['aio_flipper_sales']

	sales = []

	for docid in db.view('salesDesignDoc/getSpecificDateSalesDocIds', key=arrow.now().format('YYYY-MM-DD')):
		try:
			i = docid['id']

			sale = db[i]

			for item in items:
				if (item['name'] == sale['itemName']):
					sale_fromatted = [int(item['i']), int(sale['profit'])]
					break

			sales.append(sale_fromatted)
		except Exception as e:
			pass

	global amount_of_sales
	amount_of_sales = len(sales)

	sales.sort(key=lambda r: int(r[0]))

	chart_data = []

	for x in xrange(0,len(items)):
		chart_data.append([])

	for sale in sales:
		chart_data[sale[0] - 1].append(sale)

	return JsonResponse(chart_data, safe=False)

@login_required
def json_bar_profit_data(request):
	db = SERVER['aio_flipper_accounts']

	accounts = []
	total_value = 0
	cash_value = 0
	items_value = 0
	profit_today = 0
	total_profit_all_accounts = 0
	amount_of_zero_profit_days = 0

	for doc_id in db.view('accountsDesignDoc/getAllAccounts'):
		accounts.append(db[str(doc_id['id'])])

	for account in accounts:
		total_value += account['totalValue']

	db = SERVER['aio_flipper_profit_tracker']

	chart_data = []

	# today
	doc_id_today = "values-" + arrow.now().format('YYYY-MM-DD')

	if doc_id_today in db:
		profit_doc = db[doc_id_today]
		profit_today = total_value - profit_doc['startingTotalValue']

		epoch = int(round((int(time.mktime(time.strptime((doc_id_today.split('values-')[1] + ' 00:00:00'), '%Y-%m-%d %H:%M:%S'))) - time.altzone) * 1000))

		chart_data.append([epoch , int(profit_today)])
	# end of today

	for docid in db.view('_all_docs'):
		try:
			i = docid['id']

			if (i != doc_id_today):
				profit_doc = db[i]
				profit = int(profit_doc['endingTotalValue'] - profit_doc['startingTotalValue'])

				epoch = int(round((int(time.mktime(time.strptime((i.split('values-')[1] + ' 00:00:00'), '%Y-%m-%d %H:%M:%S'))) - time.altzone) * 1000))

				chart_data.append([epoch , profit])

		except Exception as e:
			pass

	chart_data.sort(key=lambda r: r[0])

	return JsonResponse(chart_data, safe=False)

@login_required
def json_bar_profit_data_today(request):
	db = SERVER['aio_flipper_accounts']

	accounts = []
	total_value = 0
	profit_today = 0
	total_profit_all_accounts = 0
	amount_of_zero_profit_days = 0

	for doc_id in db.view('accountsDesignDoc/getAllAccounts'):
		accounts.append(db[str(doc_id['id'])])

	for account in accounts:
		total_value += account['totalValue']

	db = SERVER['aio_flipper_profit_tracker']

	chart_data = []

	# today
	doc_id_today = "values-" + arrow.now().format('YYYY-MM-DD')

	if doc_id_today in db:
		profit_doc = db[doc_id_today]
		profit_today = total_value - profit_doc['startingTotalValue']

		epoch = int(round((int(time.mktime(time.strptime((doc_id_today.split('values-')[1] + ' 00:00:00'), '%Y-%m-%d %H:%M:%S'))) - time.timezone) * 1000))

		chart_data.append([epoch , int(profit_today)])
	# end of today

	return JsonResponse(chart_data, safe=False)

@login_required
def json_widget_quickstats_data(request):
	db = SERVER['aio_flipper_accounts']

	accounts = []
	total_value = 0
	cash_value = 0
	items_value = 0

	for doc_id in db.view('accountsDesignDoc/getAllAccounts'):
		accounts.append(db[str(doc_id['id'])])

	for account in accounts:
		total_value += account['totalValue']
		cash_value += account['moneyPouchValue']
		items_value += account['slotsValue']

	quickstats_data = [total_value, cash_value, items_value, amount_of_sales]

	return JsonResponse(quickstats_data, safe=False)

@login_required
def ajax_update_item(request):
	# Get the item data
	item_name = request.GET.get('item_name', None)
	item_buy_price = request.GET.get('item_buy_price', None)
	item_sell_price = request.GET.get('item_sell_price', None)

	# Get the item doc
	db = SERVER['aio_flipper_items']
	item = db[item_name]

	# Update the item
	item['currentBuyPrice'] = int(item_buy_price)
	item['currentSellPrice'] = int(item_sell_price)

	db.save(item)

	return JsonResponse({'success': True}, safe=False)
