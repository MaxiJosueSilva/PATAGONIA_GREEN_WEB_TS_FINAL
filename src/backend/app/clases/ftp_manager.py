import ftplib
import os
import logging

class FTPServerManager:
    def __init__(self, host, port, username, password):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.connection = None
        self.is_connected = False
        logging.basicConfig(level=logging.INFO)
    
    def connect(self):
        try:
            self.connection = ftplib.FTP()
            self.connection.connect(self.host, self.port)
            self.connection.login(self.username, self.password)
            self.is_connected = True
            logging.info(f"Connected to FTP server {self.host}")
        except ftplib.all_errors as e:
            logging.error(f"Failed to connect to FTP server: {e}")
            self.is_connected = False
    
    def disconnect(self):
        if self.connection:
            self.connection.quit()
            self.is_connected = False
            logging.info(f"Disconnected from FTP server {self.host}")
    
    def upload_file(self, local_path, remote_path):
        if not self.is_connected:
            self.connect()
        
        if not self.is_connected:
            raise Exception("Could not connect to FTP server.")

        try:
            with open(local_path, 'rb') as file:
                self.connection.storbinary(f'STOR {remote_path}', file)
            logging.info(f"Uploaded file {local_path} to {remote_path}")
        except Exception as e:
            logging.error(f"Failed to upload file {local_path} to {remote_path}: {str(e)}")
            raise

    def download_file(self, remote_path, local_path):
        try:
            with open(local_path, 'wb') as file:
                self.connection.retrbinary(f'RETR {remote_path}', file.write)
            logging.info(f"Downloaded file {remote_path} to {local_path}")
        except ftplib.all_errors as e:
            logging.error(f"Failed to download file {remote_path} to {local_path}: {e}")
    
    def list_files(self, directory):
        try:
            files = self.connection.nlst(directory)
            logging.info(f"Files in {directory}: {files}")
            return files
        except ftplib.all_errors as e:
            logging.error(f"Failed to list files in {directory}: {e}")
            return []
    
    def change_directory(self, directory):
        try:
            self.connection.cwd(directory)
            logging.info(f"Changed working directory to {directory}")
        except ftplib.all_errors as e:
            logging.error(f"Failed to change directory to {directory}: {e}")
    
    def create_directory(self, directory):
        try:
            self.connection.mkd(directory)
            logging.info(f"Created directory {directory}")
        except ftplib.all_errors as e:
            logging.error(f"Failed to create directory {directory}: {e}")
    
    def remove_file(self, remote_path):
        try:
            self.connection.delete(remote_path)
            logging.info(f"Removed file {remote_path}")
        except ftplib.all_errors as e:
            logging.error(f"Failed to remove file {remote_path}: {e}")
    
    def remove_directory(self, directory):
        try:
            self.connection.rmd(directory)
            logging.info(f"Removed directory {directory}")
        except ftplib.all_errors as e:
            logging.error(f"Failed to remove directory {directory}: {e}")
    
    def get_file_size(self, remote_path):
        try:
            size = self.connection.size(remote_path)
            logging.info(f"Size of file {remote_path}: {size} bytes")
            return size
        except ftplib.all_errors as e:
            logging.error(f"Failed to get size of file {remote_path}: {e}")
            return None
    
    def rename_file(self, old_name, new_name):
        try:
            self.connection.rename(old_name, new_name)
            logging.info(f"Renamed file {old_name} to {new_name}")
        except ftplib.all_errors as e:
            logging.error(f"Failed to rename file {old_name} to {new_name}: {e}")
    
    def get_current_directory(self):
        try:
            directory = self.connection.pwd()
            logging.info(f"Current working directory: {directory}")
            return directory
        except ftplib.all_errors as e:
            logging.error(f"Failed to get current directory: {e}")
            return None
    
    def check_connection(self):
        if self.is_connected:
            try:
                self.connection.voidcmd("NOOP")
                logging.info(f"Connection to FTP server {self.host} is alive")
                return True
            except ftplib.all_errors as e:
                logging.error(f"Connection to FTP server {self.host} is not alive: {e}")
                self.is_connected = False
                return False
        else:
            logging.warning(f"Not connected to any FTP server")
            return False
    
    def save_image(self, local_path, remote_directory, filename):
        if not self.is_connected:
            self.connect()
        
        # Ensure we are in the correct directory
        self.change_directory(remote_directory)
        
        remote_path = os.path.join(remote_directory, filename)
        self.upload_file(local_path, remote_path)
        logging.info(f"Saved image {filename} to {remote_directory}")
    
    def get_file_timestamp(self, remote_path):
        try:
            timestamp = self.connection.sendcmd(f"MDTM {remote_path}")
            logging.info(f"Timestamp of file {remote_path}: {timestamp}")
            return timestamp
        except ftplib.all_errors as e:
            logging.error(f"Failed to get timestamp of file {remote_path}: {e}")
            return None
    
    def move_file(self, remote_path, new_path):
        self.rename_file(remote_path, new_path)
    
    def list_directories(self, directory):
        try:
            directories = []
            self.connection.retrlines(f'LIST {directory}', lambda x: directories.append(x.split()[-1]) if x.startswith('d') else None)
            logging.info(f"Directories in {directory}: {directories}")
            return directories
        except ftplib.all_errors as e:
            logging.error(f"Failed to list directories in {directory}: {e}")
            return []

if __name__ == "__main__":
    ftp_manager = FTPServerManager('172.40.20.114', 21, 'maxi', 'maxi2021$')
    ftp_manager.connect()

    current_directory = ftp_manager.get_current_directory()

    # Verificar si el directorio 'Form_Imagenes' ya existe
    directories = ftp_manager.list_directories(current_directory)
    if 'Form_Imagenes' not in directories:
        try:
            ftp_manager.create_directory(os.path.join(current_directory, 'Form_Imagenes'))
        except Exception as e:
            logging.error(f"Failed to create directory Form_Imagenes: {e}")
    else:
        logging.info(f"Directory 'Form_Imagenes' already exists")

    # Cambiar al directorio 'Form_Imagenes'
    try:
        ftp_manager.change_directory('/ftp/maxi/Form_Imagenes/')
    except Exception as e:
        logging.error(f"Failed to change to directory 'Form_Imagenes': {e}")

    # Guardar la imagen
    local_image_path = r"C:\Users\maxim\OneDrive\Documentos\GitHub\PATAGONIA_GREEN_WEB\patagonia_web\backend-flask\app\uploads\300105.png"  # Cambia esto a la ruta de tu imagen local
    remote_image_filename = '300105.png'  # Cambia esto al nombre con el que quieres guardar la imagen en el servidor
    try:
        ftp_manager.save_image(local_image_path, '/ftp/maxi/Form_Imagenes/', remote_image_filename)
    except Exception as e:
        logging.error(f"Failed to save image {remote_image_filename} to /ftp/maxi/Form_Imagenes: {e}")

    ftp_manager.disconnect()
