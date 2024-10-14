#from adam6xxx import ADAM6060

#adam = ADAM6060(ip='172.40.30.91', connect=True)

# Turn on an output
#adam.set_digital_output(index=1, state=False)

# Read an input
#result = adam.get_digital_input(index=1)
#if result:
#    print('High')
#else:
#    print('Low')

# Read a counter value
#counter = adam.get_counter(index=1)
#print (counter)

from adam6xxx import ADAM6060

adam = ADAM6060(ip='10.10.110.53', connect=True)

# Leer los estados de los 6 puertos de entrada
# Leer los estados de las entradas digitales según la librería adam6xxx.py
resultado = adam.get_digital_input(0)

for i in resultado.bits:
    if i == True:
        print(f'Entrada digital {i}: Alto')
    else:
        print(f'Entrada digital {i}: Bajo')
