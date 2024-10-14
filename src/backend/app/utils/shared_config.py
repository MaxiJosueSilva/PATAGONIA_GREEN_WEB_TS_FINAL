# app/utils/shared_config.py
from threading import Lock

class SharedConfig:
    def __init__(self):
        self.ping_camaras = []
        self.ping_comisarias = []
        self.ping_predios = []
        self.ping_clientes = []
        self.onus = []
        self.alarmas = []
        self.data_onus = []
        self.data_relaciones_onus = []
        self.data_relaciones_3d = []
        self.data_all_onus = []
        self.lock = Lock()

    def update_ping_camaras(self, results):
        with self.lock:
            self.ping_camaras = results

    def get_ping_camaras(self):
        with self.lock:
            return self.ping_camaras
    def update_ping_comisarias(self, results):
        with self.lock:
            self.ping_comisarias = results

    def get_ping_comisarias(self):
        with self.lock:
            return self.ping_comisarias
    
    def update_ping_clientes(self, results):
        with self.lock:
            self.ping_clientes = results

    def get_ping_clientes(self):
        with self.lock:
            return self.ping_clientes
        
    def update_ping_predios(self, results):
        with self.lock:
            self.ping_predios = results

    def get_ping_predios(self):
        with self.lock:
            return self.ping_predios

    def update_onus(self, results):
        with self.lock:
            self.onus = results

    def get_onus(self):
        with self.lock:
            return self.onus
            
    def update_alarmas(self, results):
        with self.lock:
            self.alarmas = results

    def get_alarmas(self):
        with self.lock:
            return self.alarmas
            
    def update_data_onus(self, results):
        with self.lock:
            self.data_onus = results

    def get_data_onus(self):
        with self.lock:
            return self.data_onus
    
    def update_relaciones_onus(self, results):
        with self.lock:
            self.data_relaciones_onus = results

    def get_relaciones_onus(self):
        with self.lock:
            return self.data_relaciones_onus
    
    def update_data_3d(self, results):
        with self.lock:
            self.data_relaciones_3d = results

    def get_data_3d(self):
        with self.lock:
            return self.data_relaciones_3d

    def update_all_onus_data(self, results):
        with self.lock:
            self.data_all_onus = results

    def get_all_onus_data(self):
        with self.lock:
            return self.data_all_onus

shared_config = SharedConfig()
