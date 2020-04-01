import sys
import json
import numpy as np

def main():
	lines = read_stdin()

	# parse args
	hello = lines['hello']

	# pass args to qr model and calculate result

	# pack result into dictionary for json dumping
	result = {}
	result["hello"] = hello

	# return the result to runPy.js via stdOut
	print(json.dumps(result))

# Read data from stdin
def read_stdin():
  lines = sys.stdin.readlines()
  # Since our input would only be having one line, parse our JSON data from that
  return json.loads(lines[0])


if __name__ == '__main__':
	main()