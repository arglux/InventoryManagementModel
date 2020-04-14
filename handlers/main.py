import sys
import json
import numpy as np
import methods as m
import performance as perf
from distribution import Demand, pdf
from model import Cost, QRModel

def main():
	lines = read_stdin()

	# parse args
	A = int(lines['A'])
	h = int(lines['h'])
	b = int(lines['b'])
	i0 = int(lines['i0'])
	b0 = 0
	L = int(lines['L'])
	X = lines['X']
	Y = np.asarray(lines['Y'], dtype=np.int64) # must be np.array
	Q = np.asarray(lines['Q'], dtype=np.int64)
	I = np.asarray(lines['I'], dtype=np.int64)
	B = np.asarray(lines['B'], dtype=np.int64)

	# pass args to qr model and calculate result
	y = np.bincount(Y)
	x = np.arange(np.max(Y) + 1)
	params, perr, bic = m.fit_distribution(pdf, x, y)
	mu, sig, p = params
	demand = Demand(mu, sig, p)

	# extrapolate directly from sample
	demand = m.extrapolate_sample(Y, L)

	# for normal distribution
	# from scipy.stats import norm
	# normpdf = lambda x, mu, sig: norm.cdf(np.round(x)+0.5, mu, sig) - norm.cdf(np.round(x)-0.5, mu, sig)
	# params, perr, bic = m.fit_distribution(normpdf, X, Y)
	# mu, sig = params

	# calculate result
	cost = Cost(A, h, b, 0)
	model = QRModel(demand, cost)
	kyu, r, total_cost = model.numeric_optimize_backorder()
	I_optimized, B_optimized, Q_optimized, f = perf.simulate(Y, i0, b0, kyu, r, L)

	# pack result into dictionary for json dumping
	result = {}
	result["A"] = A
	result["h"] = h
	result["b"] = b
	result["L"] = L

	result["mu"] = mu
	result["std"] = sig
	result["kyu"] = kyu
	result["r"] = r
	result["c"] = total_cost
	result["f"] = f

	result["y"] = y.tolist()
	result["x"] = x.tolist()
	result["Q_optimized"] = Q_optimized
	result["I_optimized"] = I_optimized
	result["B_optimized"] = B_optimized

	# return the result to runPy.js via stdOut
	print(json.dumps(result))

# Read data from stdin
def read_stdin():
  lines = sys.stdin.readlines()
  # Since our input would only be having one line, parse our JSON data from that
  return json.loads(lines[0])


if __name__ == '__main__':
	main()
