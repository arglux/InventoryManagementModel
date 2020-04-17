from copy import deepcopy

class FixedStrategy:
	def __init__(self, data):
		self.data = data

	def decision(self, day, stock):
		return self.data[day-1] if day <= len(self.data) else 0


class QRStrategy:
	def __init__(self, Q, r):
		self.Q = round(Q)
		self.r = round(r)

	def decision(self, day, stock):
		return self.Q if stock <= self.r else 0


class Cost:
	def __init__(self, fixed, holding, backorder):
		self.fixed = fixed
		self.holding = holding
		self.backorder = backorder


# demand is a list of demands for each day.
# cost is an object which contains backorder, holding, and fixed.
# restock_strategy is the restock strategy
# initial_stock is a number which contains the initial stock.
# orders is the initial set of existing orders
class SimulationModel:
	def __init__(self, demand, cost, restock_strategy, initial_stock, orders=[], lead_time=60):
		self.demand = demand
		self.cost = cost
		self.strategy = restock_strategy
		self.stock = initial_stock
		self.lead_time = lead_time
		self.orders = deepcopy(orders)

		self.day = 1
		self.backorders = 0
		self.backorder_cost = 0
		self.holding_cost = 0
		self.fixed_cost = 0
		self.satisfied = 0
		self.data = {"inventory":[], "demand":deepcopy(demand), "orders":[], "backorders":[], "fixed_cost":[], "holding_cost":[], "backorder_cost":[], "fill_rate":0}

	def run(self, verbose=False):
		while self.day < len(self.demand):
			self.iterate(verbose=verbose)
		self.data["fill_rate"] = self.satisfied/sum(self.demand)
		return self.fixed_cost, self.holding_cost, self.backorder_cost, self.data

	def maintain_orders(self):
		for i in range(len(self.orders)):
			self.orders[i][1] -= 1

	def iterate(self, verbose=False):
		backlog = self.backorders
		day_demand = self.demand[self.day-1] + self.backorders
		self.backorders = 0
		# check if order arrived
		day_fixed = 0
		if self.orders:
			if self.orders[0][1] == 0:
				self.stock += self.orders[0][0]
				self.data["orders"].append(int(self.orders[0][0]))
				day_fixed = self.cost.fixed * self.orders[0][0]
				self.orders.pop(0)
			else:
				self.data["orders"].append(0)
		else:
			self.data["orders"].append(0)
		self.satisfied += min(self.demand[self.day-1], max(0, self.stock - backlog))

		# expression of demand
		if self.stock >= day_demand:
			self.stock -= day_demand
		else:
			self.backorders = day_demand - self.stock
			self.stock = 0

		# purchase decision
		purchase = self.strategy.decision(self.day, self.stock + sum([order[0] for order in self.orders]) - self.backorders)
		if purchase: self.orders.append([purchase, self.lead_time])
		self.maintain_orders()

		# execute costs
		day_holding = self.cost.holding * self.stock
		day_backorder = self.cost.backorder * self.backorders

		self.fixed_cost += day_fixed
		self.holding_cost += day_holding
		self.backorder_cost += day_backorder

		if verbose: print("Day {} - Stock: {}, Demand: {}, Backorders: {}".format(self.day, self.stock, self.demand[self.day-1], self.backorders))

		self.data["inventory"].append(int(self.stock))
		self.data["backorders"].append(int(self.backorders))
		self.data["fixed_cost"].append(day_fixed)
		self.data["holding_cost"].append(day_holding)
		self.data["backorder_cost"].append(day_backorder)
		self.day += 1
