from pymongo import MongoClient

class MongoDB:
    def __init__(self, host='172.40.20.114', port=27017, database=None):
        self.client = MongoClient(host, port)
        self.database = self.client[database] if database else None

    def connect(self, host, port, database):
        self.client = MongoClient(host, port)
        self.database = self.client[database]

    def insert_document(self, collection, document):
        if self.database is None:
            raise Exception("No se ha establecido una base de datos. Conéctate primero.")
        
        collection = self.database[collection]
        result = collection.insert_one(document)
        return result.inserted_id

    def find_documents(self, collection, query=None):
        if self.database is None:
            raise Exception("No se ha establecido una base de datos. Conéctate primero.")
        
        collection = self.database[collection]
        documents = collection.find(query) if query else collection.find()
        return list(documents)

    def close_connection(self):
        if self.client:
            self.client.close()

    def insert_into_lpr(self, document):
        return self.insert_document('LPR', document)

    def insert_into_facedetection(self, document):
        return self.insert_document('FaceDetection', document)

if __name__ == '__main__':
    # Ejemplo de uso:
    # Conectar y agregar un documento a la colección "ejemplo"
    mongo = MongoDB(database='db911')
    document_to_insert = {'campo1': 'valor1', 'campo2': 'valor2'}
    mongo.insert_document('ejemplo', document_to_insert)

    # Buscar todos los documentos en la colección "ejemplo"
    result = mongo.find_documents('ejemplo')
    for doc in result:
        print(doc)

    # Cerrar la conexión
    mongo.close_connection()
