
import re

latex_content_raw = r"""
        stack1 & GradientBoosting$_{\text{global}}$ & 2 & 0.770 & 23.648 & 11.663 \\
        stack1 & LinearRegression$_{\text{global}}$ & 2 & 0.787 & 22.768 & 11.607 \\
        stack1 & Ridge$_{\text{global}}$            & 2 & 0.787 & 22.769 & 11.607 \\
        stack1 & RandomForest$_{\text{global}}$     & 2 & 0.740 & 25.152 & 12.875 \\
        stack1 & SVR$_{\text{global}}$              & 2 & 0.781 & 23.109 & 11.368 \\
        \textbf{stack1} & \textbf{MLP}$_{\text{global}}$   & \textbf{2} & \textbf{0.789} & \textbf{22.650} & \textbf{11.556} \\
        % ---------- STACK 2 ----------
        stack2 & GradientBoosting$_{\text{global}}$ & 3 & 0.779 & 23.183 & 11.527 \\
        stack2 & LinearRegression$_{\text{global}}$ & 3 & 0.791 & 22.565 & 11.429 \\
        stack2 & Ridge$_{\text{global}}$            & 3 & 0.791 & 22.566 & 11.429 \\
        stack2 & RandomForest$_{\text{global}}$     & 3 & 0.755 & 24.446 & 12.345 \\
        stack2 & SVR$_{\text{global}}$              & 3 & 0.786 & 22.853 & 11.214 \\
        \textbf{stack2} & \textbf{MLP}$_{\text{global}}$ & \textbf{3} & \textbf{0.794} & \textbf{22.405} & \textbf{11.403} \\
        % ---------- STACK 3 ----------
        stack3 & GradientBoosting$_{\text{global}}$ & 4 & 0.774 & 23.442 & 11.477 \\
        stack3 & LinearRegression$_{\text{global}}$ & 4 & 0.788 & 22.735 & 11.456 \\
        stack3 & Ridge$_{\text{global}}$            & 4 & 0.788 & 22.735 & 11.454 \\
        stack3 & RandomForest$_{\text{global}}$     & 4 & 0.748 & 24.768 & 12.394 \\
        stack3 & SVR$_{\text{global}}$              & 4 & 0.783 & 22.995 & 11.218 \\
        \textbf{stack3} & \textbf{MLP}$_{\text{global}}$              & \textbf{4} & \textbf{0.787} & \textbf{22.774} & \textbf{11.333} \\
        % ---------- STACK 4 ----------
        stack4 & GradientBoosting$_{\text{global}}$ & 5 & 0.772 & 23.553 & 11.476 \\
        stack4 & LinearRegression$_{\text{global}}$ & 5 & 0.790 & 22.602 & 11.416 \\
        stack4 & Ridge$_{\text{global}}$            & 5 & 0.790 & 22.601 & 11.415 \\
        stack4 & RandomForest$_{\text{global}}$     & 5 & 0.751 & 24.650 & 12.208 \\
        stack4 & SVR$_{\text{global}}$              & 5 & 0.785 & 22.873 & 11.183 \\
        \textbf{stack4} & \textbf{MLP}$_{\text{global}}$              & \textbf{5} & \textbf{0.792} & \textbf{22.531} & \textbf{11.315} \\
        % ---------- STACK 5 ----------
        stack5 & GradientBoosting$_{\text{global}}$ & 6 & 0.773 & 23.492 & 11.421 \\
        stack5 & LinearRegression$_{\text{global}}$ & 6 & 0.791 & 22.571 & 11.387 \\
        stack5 & Ridge$_{\text{global}}$            & 6 & 0.791 & 22.572 & 11.384 \\
        stack5 & RandomForest$_{\text{global}}$     & 6 & 0.760 & 24.187 & 12.029 \\
        stack5 & SVR$_{\text{global}}$              & 6 & 0.785 & 22.864 & 11.162 \\
        \textbf{stack5} & \textbf{MLP}$_{\text{global}}$ & \textbf{6} & \textbf{0.794} & \textbf{22.387} & \textbf{11.307} \\
"""

def clean_value(v):
    v = v.strip()
    v = v.replace(r'\\', '').strip()
    # Non-greedy match for value inside bold
    m = re.match(r'\\textbf\{(.+?)\}', v)
    if m:
        v = m.group(1)
    
    # Just in case cleanup
    v = v.replace('}', '').replace('{', '')
    return float(v)

data = []
for line in latex_content_raw.strip().split('\n'):
    line = line.strip()
    if not line or line.startswith('%') or line.startswith(r'\hline'):
        continue

    parts = [p.strip() for p in line.split('&')]
    # columns: Stack, Metamodel, Bases, R2, RMSE, MAE
    if len(parts) < 6:
        continue

    # Clean values using helper function
    try:
        r2 = clean_value(parts[3])
        rmse = clean_value(parts[4])
        mae = clean_value(parts[5])
        
        # Model Name Construction
        # Stack part
        s_part = parts[0]
        m = re.match(r'\\textbf\{(.+?)\}', s_part)
        if m: s_part = m.group(1)
        s_part = s_part.strip().capitalize()
        
        # Meta part
        m_part = parts[1]
        # Non-greedy match for bold meta model name
        m = re.match(r'\\textbf\{(.+?)\}(.*)', m_part) 
        if m: 
            m_part = m.group(1) + m.group(2)
        m_part = m_part.strip()
        
        model_name = f"{s_part} {m_part}"
        
        data.append({
            'name': model_name,
            'r2': r2,
            'rmse': rmse,
            'mae': mae
        })
    except Exception as e:
        print(f"Error parsing line: {line}")
        print(e)
        continue

# Sort: R2 desc, then RMSE asc
data.sort(key=lambda x: (-x['r2'], x['rmse']))

# Find best for bolding
best_model = data[0]

print(r"\begin{longtable}{lrrr}")
print(r"    \caption{Resultados de las diferentes configuraciones de stacking utilizando IFN2 e IFN3 como explicativos de la variable en tC/ha.}")
print(r"    \label{tab:stack_ifn2_ifn3c_resultados} \\")
print(r"    \toprule")
print(r"    Modelo            & $R^2_{\text{test}}$ & RMSE$_{\text{test}}$ & MAE$_{\text{test}}$ \\")
print(r"    \midrule")
print(r"    \endfirsthead")
print(r"")
print(r"    \toprule")
print(r"    Modelo            & $R^2_{\text{test}}$ & RMSE$_{\text{test}}$ & MAE$_{\text{test}}$ \\")
print(r"    \midrule")
print(r"    \endhead")
print(r"")
print(r"    \midrule")
print(r"    \multicolumn{4}{r}{{Continúa en la siguiente página...}} \\")
print(r"    \endfoot")
print(r"")
print(r"    \bottomrule")
print(r"    \endlastfoot")
print(r"")

for row in data:
    name = row['name']
    r2_str = f"{row['r2']:.3f}"
    rmse_str = f"{row['rmse']:.3f}"
    mae_str = f"{row['mae']:.3f}"
    
    if row == best_model:
        line = f"    \\textbf{{{name}}} & \\textbf{{{r2_str}}} & \\textbf{{{rmse_str}}} & \\textbf{{{mae_str}}} \\\\"
    else:
        line = f"    {name} & {r2_str} & {rmse_str} & {mae_str} \\\\"
    print(line)

print(r"\end{longtable}")
