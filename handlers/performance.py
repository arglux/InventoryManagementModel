import numpy as np
import matplotlib.pyplot as plt
import scipy.stats as stats
import scipy.optimize as optimize
from tqdm import tqdm

def simulate(Y, i0, b0, Q, r, L):
	'''
	returns inventory and backorder and ordered qty simulated values as 3 lists, one for each
	e.g. inventory = [12, 13, 0], backorder = [0, 0, 17], ordered = [0, 0, 50]
	'''
	inventory = []
	backorder = []
	ordered = []
	length = Y.size

	reorder_at = lambda ending_inventory: True if ending_inventory <= r else False
	order_otw = -1	# counts the arrival of reordered stock, if not -1, CANNOT reorder any more
	order_comes = lambda order_otw: True if order_otw == 0 else False
	q = lambda order_comes: int(round(Q, 0)) if order_comes else 0

	for idx in range(length):
		# advance order_otw by 1 unit if otw, if order has arrived, +Q and set order_otw to -1
		if order_otw != -1:
			order_otw = (order_otw + 1) % L

		if idx == 0: # the first inventory & backorder uses i0 (starting/leftover inventory)
			i = getEndingInventory(Y[idx], i0)
			b = getBackorder(Y[idx], i0, b0)
			i, b, o, order_otw = addQ(i, b, q(order_comes(order_otw)), order_otw)
			inventory.append(int(i))
			backorder.append(int(b))
			ordered.append(int(o))
		else: # for demand Y index=1 to n, use previous value of ending_inventory and current Y
			i = getEndingInventory(Y[idx], inventory[idx-1])
			b = getBackorder(Y[idx], inventory[idx-1], backorder[idx-1])
			i, b, o, order_otw = addQ(i, b, q(order_comes(order_otw)), order_otw)
			inventory.append(int(i))
			backorder.append(int(b))
			ordered.append(int(o))

		# checks if ending_inventory hits reorder quantity => reorder and start counting
		if reorder_at(i) and order_otw == -1: order_otw = (order_otw + 1) % L

	return inventory, backorder, ordered, 100 * (sum(Y) - sum(backorder))/sum(Y)


def getEndingInventory(demand, starting_inv):
	ending_inv = starting_inv - demand
	if ending_inv < 0: return 0
	else: return ending_inv

def getBackorder(demand, starting_inv, previous_backorder):
	backorder = starting_inv - demand - previous_backorder
	if backorder < 0: return -backorder
	else: return 0

def addQ(i, b, q, order_otw):
	if q == 0: return i, b, 0, order_otw
	if b != 0:
		b = b - q
		if (b < 0):
			i = i + -b
			b = 0
		return i, b, q, -1
	else:
		i = i + q
		return i, b, q, -1


#################################################################

def simulateQIBCost(Q, Q_cost, I, I_cost, B, B_cost, fixed_cost):
	Qc = getParameterCost(Q, Q_cost)
	Ic = getParameterCost(I, I_cost)
	Bc = getParameterCost(B, B_cost)
	Tc = getTotalSimulatedCost(Qc, Ic, Bc, fixed_cost)
	return Qc, Ic, Bc, Tc

def getParameterCost(param, variable_cost):
	cost = param * variable_cost
	return cost.tolist()

def getTotalSimulatedCost(Qc, Ic, Bc, fixed_cost):
	total_simulated_cost = []
	for i in range(len(Qc)):
		if Qc[i] > 0: total_simulated_cost.append(Qc[i] + Ic[i] + Bc[i] + fixed_cost)
		else: total_simulated_cost.append(Ic[i] + Bc[i])

	return total_simulated_cost

#################################################################

def test1():
	Y = np.array(['10', '10'], dtype=np.int64)
	print(Y)
	print(Y[0])
	print(getEndingInventory(Y[0], 5))
	print(getBackorder(Y[0], 5))
	print(Y.size)

	for i in range(2):
		print(i)

def test2():
	Y = np.array(['10', '10', '10', '10'], dtype=np.int64)
	print(Y)
	print(simulate(Y, 10, 0, 40, 0, 2))

def test3():
	Y = np.array(['10', '10', '10', '10'], dtype=np.int64)
	print(Y)
	print(getParameterCost(Y, 22))
	print(simulateQIBCost(Y, 22, Y, 33, Y, 11, 20))

if __name__ == '__main__':
	test3()
