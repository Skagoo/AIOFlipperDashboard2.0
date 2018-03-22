from django.shortcuts import render

def index(request):
	context = {}
	template = loader.get_template('webapp/index.html')
	return HttpResponse(template.render(context, request))
