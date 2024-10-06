#!/usr/bin/env python3

import json

MIN_MATCH = 100

def have_same_prefix(s1, s2):
    min_len = min(len(s1), len(s2))
    
    # Compare character by character
    prefix = ""
    for i in range(min_len):
        if s1[i] == s2[i]:
            prefix += s1[i]  # Add to the prefix if they are the same
        else:
            break  # Stop when characters no longer match
    return len(prefix) > 0 and prefix != s1 and prefix != s2

def have_same_suffix(s1, s2):
    min_len = min(len(s1), len(s2))
    
    # Compare character by character from the end
    suffix = ""
    for i in range(1, min_len + 1):  # We use 1-based index to check from the end
        if s1[-i] == s2[-i]:
            suffix = s1[-i] + suffix  # Add to the suffix if they are the same
        else:
            break  # Stop when characters no longer match
    return len(suffix) > 0 and suffix != s1 and suffix != s2

def find_full_and_partial_matches(strings):
    # Store results
    full_matches = {}
    partial_matches = {}
    
    # Compare each string with the others
    for i in range(len(strings)):
        for j in range(i+1, len(strings)):
            if strings[i] == strings[j]:
              k = strings[i]
              if k in full_matches:
                  full_matches[k] += 1
              else:
                  full_matches[k] = 1
            elif have_same_prefix(strings[i], strings[j]) or have_same_suffix(strings[i], strings[j]):
              k = strings[i]
              if k in partial_matches:
                  partial_matches[k] += 1
              else:
                  partial_matches[k] = 1                
                
    return full_matches, partial_matches

def find_matches_in_filtered_entries(dataset):
    filtered_strings = []
    
    # Filter entries by type: JSRope or JSLinearString
    for entry in dataset:
        if "JSRope" in entry["address"] or "JSLinearString" in entry["address"]:
            filtered_strings.append(entry["value"])

    return find_full_and_partial_matches(filtered_strings)

# Example dataset
with open("typescript.json") as fp:
  dataset = json.loads(fp.read())

# Find matches
full_matches, partial_matches = find_matches_in_filtered_entries(dataset)

# Output the results
with open("matches.json") as fp:
    json.dump({
      "full_matches": len(full_matches),
      "partial_matches": len(partial_matches)
    }, fp)
