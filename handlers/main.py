import sys
import json
import numpy as np
import methods as m
import performance as perf
import simulation as sim
from distribution import Demand, pdf
from model import Cost, QRModel

def main():
	lines = read_stdin()

	# parse args
	A = int(lines['A'])
	h = int(lines['h'])
	b = int(lines['b'])
	P = int(lines['P'])
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

	qr_model = sim.SimulationModel(Y, sim.Cost(A, h, b), sim.QRStrategy(kyu, r), i0, lead_time=L)
	_, _, _, result = qr_model.run()
	I_optimized = result["inventory"]
	B_optimized = result["backorders"]
	Q_optimized = result["orders"] 
	f = result["fill_rate"] * 100
	# Qc_optimized = result["fixed_cost"]
	# Ic_optimized = result["holding_cost"]
	# Bc_optimized = result["backorder_cost"]
	# Tc_optimized = np.array(Qc_optimized) + np.array(Ic_optimized) + np.array(Bc_optimized)

	Q_opt = np.asarray(Q_optimized, dtype=np.int64)
	I_opt = np.asarray(I_optimized, dtype=np.int64)
	B_opt = np.asarray(B_optimized, dtype=np.int64)
	# get cost data for original and optimized QIB params
	Qc, Ic, Bc, Tc = perf.simulateQIBCost(Q, P, I, h, B, b, A)
	Qc_optimized, Ic_optimized, Bc_optimized, Tc_optimized = perf.simulateQIBCost(Q_opt, P, I_opt, h, B_opt, b, A)

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

	result["Qc"] = Qc
	result["Ic"] = Ic
	result["Bc"] = Bc
	result["Tc"] = Tc
	result["Qc_optimized"] = Qc_optimized
	result["Ic_optimized"] = Ic_optimized
	result["Bc_optimized"] = Bc_optimized
	result["Tc_optimized"] = Tc_optimized

	# return the result to runPy.js via stdOut
	print(json.dumps(result))

# Read data from stdin
def read_stdin():
  lines = sys.stdin.readlines()
  # Since our input would only be having one line, parse our JSON data from that
  return json.loads(lines[0])


if __name__ == '__main__':
	main()
