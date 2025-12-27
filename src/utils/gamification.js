// src/utils/gamification.js

/**
 * 숲 성장 계산기 (Forest Growth Calculator)
 * - 루틴 5회 = 물방울 1개
 * - 물방울 29개 = 나무 1그루
 */
export function calculateForestGrowth(currentStreak, currentWater, currentTrees) {
    // 방어 코드: 숫자가 아니면 0으로 처리 (NaN 방지)
    let streak = Math.max(0, Number(currentStreak) || 0);
    let water = Math.max(0, Number(currentWater) || 0);
    let trees = Math.max(0, Number(currentTrees) || 0);

    // 1. 루틴 완료 시 스트릭(연속 횟수) 1 증가
    streak += 1;

    // 2. 물방울 지급 로직 (5회마다)
    if (streak % 5 === 0) {
        water += 1;
    }

    // 3. 나무 성장 로직 (물방울 29개 소모)
    let treesGrown = 0; // 이번 턴에 자란 나무 수
    while (water >= 29) {
        water -= 29;
        trees += 1;
        treesGrown += 1;
    }

    return {
        streak,
        water,
        trees,
        treesGrown // UI에서 "나무가 자랐어요!" 알림용
    };
}