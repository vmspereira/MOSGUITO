from rest_framework.generics import (RetrieveAPIView, GenericAPIView,
                                     ListAPIView)
from rest_framework.mixins import ListModelMixin
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django.db.models import Q
from django.conf import settings


