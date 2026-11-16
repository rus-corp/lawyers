import logging


class SkipMissingMeta(logging.Filter):
    """The site asks for an SEO record on every page; most pages have none, which is not worth a log line."""

    def filter(self, record):
        request = getattr(record, 'request', None)
        missing_meta = (
            getattr(record, 'status_code', None) == 404
            and request is not None
            and request.path.startswith('/api/meta/')
        )
        return not missing_meta
