import re

# Nome do arquivo de entrada
input_file = 'maqs_1.txt'
# Nome do arquivo de saída
output_file = 'maqs.txt'

# Função para remover a numeração
def remove_numeracao(linha):
    return re.sub(r'^\d+\.\s*', '', linha)

# Abrindo o arquivo de entrada e lendo as linhas
with open(input_file, 'r', encoding='utf-8') as file:
    linhas = file.readlines()

# Removendo a numeração de cada linha
linhas_sem_numeracao = [remove_numeracao(linha) for linha in linhas]

# Escrevendo as linhas modificadas no arquivo de saída
with open(output_file, 'w', encoding='utf-8') as file:
    file.writelines(linhas_sem_numeracao)

print(f'A numeração foi removida e o novo arquivo foi salvo como {output_file}')