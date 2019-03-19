from random import random, randint, sample
from math import floor, ceil
from faker import Factory
import json
import sys

def name(family=True,male=True):
  if family:
    if male:
      return fake.first_name_male()
    else:
      return fake.first_name_female()
  else:
    if male:
      return fake.name_male()
    else:
      return fake.name_female()
def genN(n, total):
  if total > n:
    dividers = sorted(sample(range(1, total), n - 1))
    return [a - b for a, b in zip(dividers + [total], [0] + dividers)]
  else:
    return [1] * total + (n-total)*[0]

#def genN(N, total):
#  p = [random() for i in range(0,N)]
#  s = sum(p)
#  return [round((q/s)*total) for q in p]
def newGuy(family, G=None, single=False):
  if G is None:
    G = randint(0,1)
  guy = {
    "n": name(family, True if G == 1 else False),
    "g": G,
    "c": []
  }
  if not single:
    guy["p"] = name(not family, False if G == 1 else True)
  return guy

locales = ["ru_RU", "fr_FR", "de_DE", "en_UK", "de_DE", "en_US"]
fake = Factory.create("fr_FR")
TOTAL = 12
children = randint(0, 4)
print("Children:", children)
newphews,grandnephews = genN(2, TOTAL-children)

parents = randint(1, 4)
siblings = randint(1, 6)
cousins = randint(1, 4)
family = fake.last_name()
username = "oboforty"


f = {
  "family": family,
  "c": [newGuy(family, 1)]
}

me = {
  # me
  "n": username,
  "me": True,
  "p": name(None, 1),
  "g": 0,
  "c": []
}
parents -= 1
g_children = parents
p_children = genN(parents, siblings)
s_children = genN(siblings, newphews)
n_children = genN(newphews, grandnephews)


print(1, "grandpa shares", parents, "children:", g_children)
print(parents, "parents share", siblings, "children:", p_children)
print(siblings, "siblings share", newphews, "children:", s_children)
print(newphews, "children share", grandnephews, "grandchildren:", n_children)

my_parent = randint(0, parents)
rs = 0
rc = 0
rn = 0
for g in range(0,1):
  print("Added grandpa", g)
  for p in range(0, g_children):
    print("Added parent", p)
    f["c"][g]["c"].append(newGuy(family, 1 if p==my_parent else None, p_children[p]==0))
    for s in range(0, p_children[p]):
      print("Added sibling", rs, s_children[rs])
      f["c"][g]["c"][p]["c"].append(newGuy(family, None, s_children[rs]==0))
      for c in range(0, s_children[rs]):
        print("Added children", rc)
        f["c"][g]["c"][p]["c"][s]["c"].append(newGuy(family, None, n_children[rc]==0))
        for n in range(0, n_children[rc]):
          print("Added grandchildren", rn)
          f["c"][g]["c"][p]["c"][s]["c"][c]["c"].append(newGuy(family, None, True))
          rn += 1
        rc += 1
      rs += 1

# Add my family
s = len(f["c"][g]["c"][p]["c"])
print("Added me", s)
f["c"][g]["c"][p]["c"].append(me)
for c in range(0, children):
  print("Added my children", c)
  f["c"][g]["c"][p]["c"][s]["c"].append(newGuy(family, None, True))

with open("gen.js", "w") as fh:
  st = json.dumps(f)
  fh.write("var nodes = " + st + ";")
