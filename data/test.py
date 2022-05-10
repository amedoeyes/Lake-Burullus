# import arcpy
# from arcpy import env
# from arcpy.sa import *
# env.workspace = "C:/Users/Amedo/Desktop/MyProject/test.gdb"

nums = [[0.243932, 0.328297], [0.328297, 0.412661]]
avg = []
for num in nums:
    tmp = []
    a = num[0]+num[1]/2
    a = int(a)
    for n in num:
        tmp.append(n)
    tmp.append(a)
    avg.append(tmp)
print(avg)

# outReclass1 = Reclassify("Extract_Ammonia_Fi", "value", RemapRange(avg))

# outReclass1.save("C:/Users/Amedo/Desktop/MyProject/test.gdb/test")
