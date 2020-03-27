import sys
import json
import numpy as np

class QRModel:
  def __init__(self, args):
    self.args = args;
  def calculate():
  	return self.args;

def read_in():
	''' reads in a line string of input arguments writen by runPy.js to stdIn
			returns a json of arguments
	'''
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

def main():
  # get arguments
  args = read_in()

  # pass in to qr model and calculate result
  qr = QRModel(args)
  result = qr.calculate()

  # return the result to runPy.js via stdOut
  print(agent_scores)

if __name__ == '__main__':
  main()
