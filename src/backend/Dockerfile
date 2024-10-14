# Imagen base de Python
FROM python:3.12

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de requerimientos
COPY requirements.txt .

# Instala las dependencias
RUN pip install -r requirements.txt

# Copia el resto de los archivos del backend
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar Flask
CMD [ "python", "wsgi.py"]
