'use client'
import React from "react";

function Estimate() {
  return (
    <div
      style={{
        width: "800px",
        margin: "0 auto",
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "14px",
        color: "#333",
        lineHeight: "1.6",
      }}
    >
      {/* 상단 날짜/제목 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>25. 2. 7. 오후 2:46</div>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>견 적 서</div>
        <div />
      </div>

      {/* 견적 정보(담당자, 견적일자, 견적금액) */}
      <div style={{ marginBottom: "20px" }}>
        <p>- 담당자: 이효선님 귀하</p>
        <p>- 견적일자: 2025년 02월 07일</p>
        <p>- 견적금액: 148,500원</p>
      </div>

      {/* 회사 정보 테이블 */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "80px", fontWeight: "bold", padding: "4px" }}>
              상 호
            </td>
            <td style={{ padding: "4px" }}>(주)티에스코리아</td>
            <td style={{ width: "80px", fontWeight: "bold", padding: "4px" }}>
              대표자
            </td>
            <td style={{ padding: "4px" }}>홍길동</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>사업자등록번호</td>
            <td style={{ padding: "4px" }}>123-45-67890</td>
            <td style={{ fontWeight: "bold", padding: "4px" }}>주&nbsp;&nbsp;소</td>
            <td style={{ padding: "4px" }}>서울시 강남구 테헤란로 10</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>업&nbsp;&nbsp;태</td>
            <td style={{ padding: "4px" }}>도소매</td>
            <td style={{ fontWeight: "bold", padding: "4px" }}>종&nbsp;&nbsp;목</td>
            <td style={{ padding: "4px" }}>전자상거래</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>전&nbsp;&nbsp;화</td>
            <td style={{ padding: "4px" }}>02-111-2222</td>
            <td style={{ fontWeight: "bold", padding: "4px" }}>팩&nbsp;&nbsp;스</td>
            <td style={{ padding: "4px" }}>02-111-3333</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>이메일</td>
            <td style={{ padding: "4px" }}>test@test.com</td>
            <td style={{ padding: "4px" }} />
            <td style={{ padding: "4px" }} />
          </tr>
        </tbody>
      </table>

      {/* 품목/내역 테이블 */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #ddd",
              background: "#f9f9f9",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "6px" }}>구분</th>
            <th style={{ padding: "6px" }}>제품명</th>
            <th style={{ padding: "6px" }}>금액 (W 148,500)</th>
          </tr>
        </thead>
        <tbody>
          {/* 첫 번째 품목 */}
          <tr>
            <td style={{ verticalAlign: "top", padding: "6px" }}>1</td>
            <td style={{ verticalAlign: "top", padding: "6px" }}>
              [사이드체어선택] x3 (+4,000)
              <br />
              <div style={{ marginLeft: "20px" }}>
                - 품목 1: 13,300원 * 2ea =&gt; 26,600원
                <br />
                - 품목 2: 8,100원 * 2ea =&gt; 16,200원
              </div>
            </td>
            <td style={{ verticalAlign: "top", padding: "6px" }} />
          </tr>
          {/* 두 번째 품목 */}
          <tr>
            <td style={{ verticalAlign: "top", padding: "6px" }}>2</td>
            <td style={{ verticalAlign: "top", padding: "6px" }}>
              Tea Glass set (카페) x 2ea
              <br />
              <div style={{ marginLeft: "20px" }}>
                - 품목 3: 14,700원 * 3ea =&gt; 44,100원
                <br />
                - 품목 4: 17,300원 * 1ea =&gt; 17,300원
              </div>
            </td>
            <td style={{ verticalAlign: "top", padding: "6px" }} />
          </tr>
        </tbody>
      </table>

      {/* 합계/부가세/견적금액 */}
      <table
        style={{
          width: "300px",
          marginLeft: "auto",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "80px", padding: "4px" }}>합계</td>
            <td style={{ textAlign: "right", padding: "4px" }}>135,000원</td>
          </tr>
          <tr>
            <td style={{ padding: "4px" }}>부가세</td>
            <td style={{ textAlign: "right", padding: "4px" }}>13,500원</td>
          </tr>
          <tr>
            <td style={{ padding: "4px", fontWeight: "bold" }}>견적금액</td>
            <td
              style={{
                textAlign: "right",
                padding: "4px",
                fontWeight: "bold",
              }}
            >
              148,500원
            </td>
          </tr>
        </tbody>
      </table>

      {/* 입금계좌 및 기타 정보 */}
      <div style={{ marginBottom: "10px" }}>
        <p>
          입금계좌: 061-XXXX-00-013 (예금주 (주)티에스코리아)
          <br />
          <a
            href="http://www.tavalon.co.kr/html/estimate_print.html?dp=0&papernumfy"
            target="_blank"
            rel="noreferrer"
          >
            www.tavalon.co.kr/html/estimate_print.html?dp=0&papernumfy
          </a>
        </p>
        <p>1/1</p>
      </div>
    </div>
  );
}

export default Estimate;
