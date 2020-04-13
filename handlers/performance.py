import numpy as np
import matplotlib.pyplot as plt
import scipy.stats as stats
import scipy.optimize as optimize
from tqdm import tqdm

def simulate(Y, i0, l, Q, r, b):
	'''
	returns inventory and backorder simulated values as 2 lists, one for each
	e.g. inventory = [12, 13, 0], backorder = [0, 0, 17]
	'''
	inventory = []
	backorder = []
	length = Y.size

	for idx in range(length):
		if idx == 0: # the first inventory & backorder uses i0 (starting/leftover inventory)
			i = getEndingInventory(Y[idx], i0)
			b = getBackorder(Y[idx], i0)

			reorder_at = lambda ending_inventory: True if ending_inventory == 0 else False
			print(reorder_at)

			inventory.append(i)
			backorder.append(b)
		else: # for demand Y index=1 to n, use previous value of ending_inventory and current Y
			i = getEndingInventory(Y[idx], inventory[idx-1])
			b = getBackorder(Y[idx], inventory[idx-1])

			inventory.append(i)
			backorder.append(b)

	return inventory, backorder


def getEndingInventory(demand, starting_inv):
	ending_inv = starting_inv - demand
	if ending_inv < 0: return 0
	else: return ending_inv

def getBackorder(demand, starting_inv):
	backorder = starting_inv - demand
	if backorder < 0: return -backorder
	else: return 0

def test():
	Y = np.array(['10', '10'], dtype=np.int64)
	print(Y)
	print(Y[0])
	print(getEndingInventory(Y[0], 5))
	print(getBackorder(Y[0], 5))
	print(Y.size)

	for i in range(2):
		print(i)
	print('lala')
	print(simulate(Y, 10, 10, 0, 500))

if __name__ == '__main__':
	test()
