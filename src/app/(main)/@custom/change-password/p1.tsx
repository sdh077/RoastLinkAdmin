"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const PasswordChange = () => {
  const supabase = createClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setMessage("");

    // 현재 로그인된 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("사용자 정보를 가져올 수 없습니다. 다시 로그인해주세요.");
      setLoading(false);
      return;
    }

    const email = (await supabase.auth.getUser()).data.user?.email ?? ''

    // 현재 비밀번호 검증 (재로그인 시도)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setMessage("현재 비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    // 비밀번호 변경 요청
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setMessage(`오류 발생: ${updateError.message}`);
    } else {
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-4">
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handlePasswordChange} disabled={loading} className="w-full">
            {loading ? "변경 중..." : "비밀번호 변경"}
          </Button>
          {message && <p className="text-red-500 text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
