import sys
import json
import numpy as np

class QRModel:
  def __init__(self, args):
    self.args = args;
  def calculate(self):
  	return self.args;

def read_in():
	lines = sys.stdin.readlines()
	return json.loads(lines[0])

def main():
	# get arguments
	args = read_in()

	# pass in to qr model and calculate result
	args = [1, 2]
	qr = QRModel(args)
	result = qr.calculate()

	# return the result to runPy.js via stdOut
	print(result)

if __name__ == '__main__':
	main()
