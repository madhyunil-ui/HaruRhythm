"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function AuthListener() {
    const router = useRouter();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // 앱 딥링크 리스너 (로그인 성공 후 앱으로 복귀 시 실행)
        const listener = App.addListener("appUrlOpen", async (data) => {
            // URL 확인: com.harurhythm.app://google-auth#access_token=...
            if (data.url.startsWith("com.harurhythm.app://")) {
                // URL에서 해시(#) 이후 파라미터 파싱
                const urlObj = new URL(data.url); // 일부 환경에서 커스텀 스키마 파싱 실패 가능성 있음, 문자열 처리 권장

                // 간단한 문자열 파싱 (URL polyfill 없이 안전하게)
                const hashIndex = data.url.indexOf("#");
                if (hashIndex !== -1) {
                    const params = new URLSearchParams(data.url.substring(hashIndex + 1));
                    const accessToken = params.get("access_token");
                    const refreshToken = params.get("refresh_token");

                    if (accessToken && refreshToken) {
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (!error) {
                            console.log("Session restored from Deep Link");
                            router.push("/"); // 로그인 성공 후 홈으로 이동
                            router.refresh();
                        } else {
                            console.error("Deep link session error:", error);
                        }
                    }
                }
            }
        });

        return () => {
            listener.then((handler) => handler.remove());
        };
    }, [router, supabase.auth]);

    return null; // UI를 렌더링하지 않는 로직 컴포넌트
}
