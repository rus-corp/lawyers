from rest_framework import generics
from rest_framework.response import Response

from .models import DocumentInstruction, DocumentSidebar
from .serializers import DocumentInstructionSerializer, DocumentSidebarSerializer


class DocumentSidebarView(generics.RetrieveAPIView):
    serializer_class = DocumentSidebarSerializer
    queryset = DocumentSidebar.objects.select_related('document').prefetch_related('sections__items')

    def get(self, request, *args, **kwargs):
        slug = self.kwargs['slug']
        sidebar = self.get_queryset().filter(document__slug=slug).first()
        if not sidebar:
            return Response(None)

        serializer = self.get_serializer(sidebar)
        return Response(serializer.data)


class DocumentInstructionView(generics.RetrieveAPIView):
    serializer_class = DocumentInstructionSerializer
    queryset = DocumentInstruction.objects.select_related('document')

    def get(self, request, *args, **kwargs):
        slug = self.kwargs['slug']
        instruction = self.get_queryset().filter(document__slug=slug).first()
        if not instruction:
            return Response(None)

        serializer = self.get_serializer(instruction)
        return Response(serializer.data)
