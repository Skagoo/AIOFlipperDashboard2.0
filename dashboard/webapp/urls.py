from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),

	# JSON
	url(r'^json/scatter_sales_data/$', views.json_scatter_sales_data, name='json_scatter_sales_data'),
	url(r'^json/bar_profit_data/$', views.json_bar_profit_data, name='json_bar_profit_data'),
]