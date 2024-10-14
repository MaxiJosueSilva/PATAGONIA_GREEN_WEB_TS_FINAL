import json
from datetime import datetime, timedelta
import pymongo

def analizar_ip(ip, collection_historial, collection_facedetection):
    resultados_por_ip = {}
    
    # Consultar la colección FaceDetection para obtener documentos por IP
    documentos = collection_facedetection.find({"ip": ip})
    
    for documento in documentos:
        fecha_documento = datetime.strptime(documento["timestamp"], "%Y-%m-%d %H:%M:%S").date()
        
        hombres = sum(1 for obj in documento["Objects"] if "Sex" in obj and obj["Sex"] == "Man")
        mujeres = sum(1 for obj in documento["Objects"] if "Sex" in obj and obj["Sex"] == "Woman")
        total_personas = hombres + mujeres
        
        if fecha_documento not in resultados_por_ip:
            resultados_por_ip[fecha_documento] = {"hombres": hombres, "mujeres": mujeres, "total": total_personas}
        else:
            resultados_por_ip[fecha_documento]["hombres"] += hombres
            resultados_por_ip[fecha_documento]["mujeres"] += mujeres
            resultados_por_ip[fecha_documento]["total"] += total_personas
    
    # Guardar los resultados en la colección MongoDB
    for fecha, resultados in resultados_por_ip.items():
        registro_existente = collection_historial.find_one({"ip": ip, "fecha": fecha.strftime("%Y-%m-%d")})
        
        if registro_existente:
            # Actualizar el registro existente
            collection_historial.update_one(
                {"_id": registro_existente["_id"]},
                {
                    "$inc": {
                        "hombres": resultados["hombres"],
                        "mujeres": resultados["mujeres"],
                        "total": resultados["total"]
                    }
                }
            )
        else:
            # Insertar un nuevo registro
            collection_historial.insert_one({
                "ip": ip,
                "fecha": fecha.strftime("%Y-%m-%d"),
                "hombres": resultados["hombres"],
                "mujeres": resultados["mujeres"],
                "total": resultados["total"]
            })


def eliminar_registros_antiguos(collection, meses=3):
    fecha_limite = datetime.now() - timedelta(days=meses*30)
    fecha_limite_str = fecha_limite.strftime("%Y-%m-%d %H:%M:%S")
    collection.delete_many({"timestamp": {"$lt": fecha_limite_str}})
    print(f"Registros anteriores a {fecha_limite_str} eliminados de la colección.")

# Ejemplo de uso
def main():
    # Conectarse a la base de datos MongoDB
    client = pymongo.MongoClient("mongodb://172.40.20.114:27017/")
    db = client["db911"]
    collection_facedetection = db["FaceDetection"]
    collection_historial = db["FaceDetection_Historial"]
    
    # Obtener todas las IPs únicas
    ips = collection_facedetection.distinct("ip")
    
    for ip in ips:
        analizar_ip(ip, collection_historial, collection_facedetection)
        print(f"Resultados para la IP {ip} guardados en la colección 'FaceDetection_Historial'")

    # Eliminar registros anteriores a 3 meses
    #collection = db["LPR"]
    #eliminar_registros_antiguos(collection, meses=3)

if __name__ == "__main__":
    main()