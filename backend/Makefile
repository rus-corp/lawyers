run:
	python manage.py runserver

mm:
	python manage.py makemigrations

mi:
	python manage.py migrate

app:
	python manage.py startapp "$(c)"

drop:
	dropdb -U postgres lawyer

create:
	createdb -U postgres lawyer

super:
	python manage.py createsuperuser

com:
	python manage.py "$(c)"