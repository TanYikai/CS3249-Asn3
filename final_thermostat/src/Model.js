export const checkMode = (T_c, T_t, currentMode) => {
    const dT = 2;
    const dT_cool = 1.5;
    const dT_heat = 1;

    if (T_c > T_t + dT + dT_cool) return "cooling";
    else if (T_c < T_t - dT - dT_heat) return "heating";
    else if (T_t - (dT - dT_heat) < T_c && T_c < T_t + (dT - dT_cool)) return "off";
    else return currentMode;
}
