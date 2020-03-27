import sys
import json
import numpy as np

class QRModel:
  def __init__(self, args):
    self.args = args;
  def calculate(self):
  	self.mu = 1
  	self.std = 0.1
  	self.p = 0.2

  	self.Q = 200
  	self.r = 50

  	result = [self.mu, self.std, self.p, self.Q, self.r]
  	return result;

def read_in():
	lines = sys.stdin.readlines()
	return json.loads(lines[0])

def main():
	# get arguments
	args = read_in()

	# pass in to qr model and calculate result
	qr = QRModel(args)
	result = qr.calculate()

	# return the result to runPy.js via stdOut
	print(result)

if __name__ == '__main__':
	main()
