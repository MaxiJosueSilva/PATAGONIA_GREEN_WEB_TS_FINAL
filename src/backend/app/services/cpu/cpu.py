import psutil

# Uso de cada CPU
cpu_usage_per_cpu = psutil.cpu_percent(percpu=True)

print('Uso de cada CPU:')
for i, percentage in enumerate(cpu_usage_per_cpu):
    print(f'CPU {i}: {percentage}%')

# Uso de la memoria
memory_info = psutil.virtual_memory()
memory_usage = memory_info.percent  # Porcentaje de memoria utilizada

# Espacio en disco
disk_info = psutil.disk_usage('/')
disk_usage = disk_info.percent  # Porcentaje de espacio en disco utilizado


print(f'Uso de la memoria: {memory_usage}%')
print(f'Uso del disco: {disk_usage}%')