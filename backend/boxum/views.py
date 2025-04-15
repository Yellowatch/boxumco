
# Health check endpoint
def health_check(request):
    from django.http import JsonResponse
    return JsonResponse({'status': 'ok'})