import json, textstat
data = json.load(open("/tmp/lesson_text.json"))
rows = []
for d in data:
    t = (d.get("text") or "").strip()
    if len(t) < 40:
        continue
    fk = textstat.flesch_kincaid_grade(t)
    fre = textstat.flesch_reading_ease(t)
    rows.append((d["id"], d.get("track"), fk, fre, len(t)))

import statistics
fks = [r[2] for r in rows]
fres = [r[3] for r in rows]
print("lessons analyzed:", len(rows))
print("Flesch-Kincaid GRADE  mean=%.2f  median=%.2f  min=%.1f  max=%.1f" % (statistics.mean(fks), statistics.median(fks), min(fks), max(fks)))
print("Flesch Reading EASE   mean=%.1f  median=%.1f  min=%.1f  max=%.1f" % (statistics.mean(fres), statistics.median(fres), min(fres), max(fres)))

# distribution by grade band
bands = {"<=4":0,"4-6":0,"6-8":0,"8-10":0,"10+":0}
for r in rows:
    g=r[2]
    if g<=4: bands["<=4"]+=1
    elif g<=6: bands["4-6"]+=1
    elif g<=8: bands["6-8"]+=1
    elif g<=10: bands["8-10"]+=1
    else: bands["10+"]+=1
print("\nGrade-level distribution:")
for k in ["<=4","4-6","6-8","8-10","10+"]:
    print("  %-6s %4d  (%.0f%%)" % (k, bands[k], 100*bands[k]/len(rows)))

# worst offenders (hardest)
rows.sort(key=lambda r:-r[2])
print("\nHardest 15 lessons (highest grade):")
for r in rows[:15]:
    print("  FK=%.1f FRE=%.0f  %-22s %s" % (r[2], r[3], r[1], r[0]))

# count above grade 8 (too hard for 8-12)
hard = [r for r in rows if r[2] > 8]
print("\nlessons above grade 8 (target = simplify):", len(hard), "(%.0f%%)" % (100*len(hard)/len(rows)))
json.dump([r[0] for r in hard], open("/tmp/hard_lessons.json","w"))
