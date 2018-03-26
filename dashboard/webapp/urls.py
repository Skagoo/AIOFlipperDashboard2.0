from django.conf.urls import url

from . import views

urlpatterns = [
	# Dashboard page
	url(r'^$', views.index, name='index'),

	# Item table page
	url(r'^tables/items/$', views.tables_items, name='tables_items'),

	# Login page
	url(r'login/$', views.login_view, name='login_view'),

	# Logout page
	url(r'logout/$', views.logout_view, name='logout_view'),

	# JSON
	url(r'^json/scatter_sales_data/$', views.json_scatter_sales_data, name='json_scatter_sales_data'),
	url(r'^json/bar_profit_data/$', views.json_bar_profit_data, name='json_bar_profit_data'),
	url(r'^json/bar_profit_data_today/$', views.json_bar_profit_data_today, name='json_bar_profit_data_today'),
	url(r'^json/widget_quickstats_data/$', views.json_widget_quickstats_data, name='json_widget_quickstats_data'),
]