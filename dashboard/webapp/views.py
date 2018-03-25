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
	context = {}
	template = loader.get_template('webapp/index.html')
	return HttpResponse(template.render(context, request))

@login_required
def tables_items(request):
	db = SERVER['aio_flipper_items']
	items = []

	for doc_id in db.view('itemsDesignDoc/getAllItems'):
		print doc_id['id']
		items.append(db[str(doc_id['id'])])
    
	for item in items:
		item['margin'] = item['currentSellPrice'] - item['currentBuyPrice']

	context = {
		'items': items,
	}

	template = loader.get_template('webapp/tables/items.html')
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

		epoch = int(round((int(time.mktime(time.strptime((doc_id_today.split('values-')[1] + ' 00:00:00'), '%Y-%m-%d %H:%M:%S'))) - time.timezone) * 1000))

		chart_data.append([epoch , int(profit_today)])
	# end of today

	for docid in db.view('_all_docs'):
		try:
			i = docid['id']

			if (i != doc_id_today):
				profit_doc = db[i]
				profit = int(profit_doc['endingTotalValue'] - profit_doc['startingTotalValue'])

				epoch = int(round((int(time.mktime(time.strptime((i.split('values-')[1] + ' 00:00:00'), '%Y-%m-%d %H:%M:%S'))) - time.timezone) * 1000))

				chart_data.append([epoch , profit])

		except Exception as e:
			pass

	chart_data.sort(key=lambda r: r[0])

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
