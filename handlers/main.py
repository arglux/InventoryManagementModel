import sys
import json
import numpy as np
import methods as m
from distribution import Demand, pdf
from model import Cost, QRModel

def main():
	lines = read_stdin()

	# parse args
	A = lines['A']
	h = lines['h']
	# b = lines['b']
	X = lines['X']
	Y = lines['Y']

	# pass args to qr model and calculate result
	# A, h, b = 1, 1, 1

	# get parameters
	params, perr, bic = m.fit_distribution(pdf, X, Y)
	mu, sig, p = params

	# for normal distribution
	# from scipy.stats import norm
	# normpdf = lambda x, mu, sig: norm.cdf(np.round(x)+0.5, mu, sig) - norm.cdf(np.round(x)-0.5, mu, sig)
	# params, perr, bic = m.fit_distribution(normpdf, X, Y)
	# mu, sig = params

	# calculate result
	demand = Demand(mu, sig, p)
	cost = Cost(A, h, b, 0)
	model = QRModel(demand, cost)

	Q, r, total_cost = model.numeric_optimize_backorder()

	# pack result into dictionary for json dumping
	result = {}
	result["mu"] = mu
	result["std"] = sig
	result["Q"] = Q
	result["r"] = r

	# return the result to runPy.js via stdOut
	print(json.dumps(result))

# Read data from stdin
def read_stdin():
  lines = sys.stdin.readlines()
  # Since our input would only be having one line, parse our JSON data from that
  return json.loads(lines[0])


if __name__ == '__main__':
	main()
