import numpy as np
from scipy.stats import norm
from model import infsum

def pdf(x, μ, σ, p):
	return cdf(np.round(x) + 0.5, μ, σ, p) - cdf(np.round(x) - 0.5, μ, σ, p)

def cdf(x, μ, σ, p):
	y = np.copy(x)
	valid = (y >= 0.5)
	invalid = (y < 0.5)
	mult = 1/(1 - norm.cdf(0.5, μ, σ))
	G = lambda z: mult * (norm.cdf(z, μ, σ) - norm.cdf(0.5, μ, σ))
	y[valid] = (1 - p) + p * G(y[valid])
	y[invalid] = 0
	return y

def ppf(x, μ, σ, p):
	if x <= 1 - p: return 0
	y = 1
	while cdf(y, μ, σ, p) < x:
		y += 1
	return y

# frozen distribution
class Demand:
	def __init__(self, μ, σ, p):
		self.μ = μ
		self.σ = σ
		self.p = p
		self.norm = norm(loc=self.μ, scale=self.σ)
		self.mult = 1/(1 - norm.cdf(0.5, self.μ, self.σ))
		self.mean = infsum(lambda x: x * self.pdf(x), -1)

	def g(self, x):
		return self.norm.pdf(x) * self.mult if x >= 0.5 else 0

	def G(self, x):
		return self.mult * (self.norm.cdf(x) - self.norm.cdf(0.5))

	# non continuity corrected
	def _pdf(self, x):
		return (1 - self.p) + self.p * self.g(0) if not x else p * self.g(x)

	def pdf(self, x):
		return self._cdf(np.round(x) + 0.5) - self._cdf(np.round(x) - 0.5)

	# non continuity corrected
	def _cdf(self, x):
		y = np.copy(x)
		valid = (y >= 0.5)
		invalid = (y < 0.5)
		y[valid] = (1 - self.p) + self.p * self.G(y[valid])
		y[invalid] = 0
		return y
		# return (1 - self.p) + self.p * self.G(x) if x >= 0 else 0

	def cdf(self, x):
		return self._cdf(np.round(x) + 0.5)

	def ppf(self, x):
		if x <= 1 - self.p: return 0
		y = 1
		while self.cdf(y) < x:
			y += 1
		return y

	def __repr__(self):
		return "Demand(μ = {}, σ = {}, p = {})".format(self.μ, self.σ, self.p)