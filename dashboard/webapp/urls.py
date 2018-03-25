from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^tables/items/$', views.tables_items, name='tables_items'),

	# JSON
	url(r'^json/scatter_sales_data/$', views.json_scatter_sales_data, name='json_scatter_sales_data'),
	url(r'^json/bar_profit_data/$', views.json_bar_profit_data, name='json_bar_profit_data'),
	url(r'^json/widget_quickstats_data/$', views.json_widget_quickstats_data, name='json_widget_quickstats_data'),
]