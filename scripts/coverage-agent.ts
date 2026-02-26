import { execSync } from "child_process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

// Inicializa o SDK do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }, // Força o Gemini a cuspir só JSON
});

// Arquivo alvo do seu projeto para o teste de hoje
const TARGET_FILE = "src/components/Timer.tsx";
const SPEC_FILE = TARGET_FILE.replace(/\.(ts|tsx)$/, ".spec.$1");
const MAX_ATTEMPTS = 3;

async function runAgent() {
  console.log("🤖 Iniciando Agente Autônomo com Gemini...");

  if (!fs.existsSync(TARGET_FILE)) {
    return console.error(
      `❌ Arquivo ${TARGET_FILE} não encontrado. Ajuste o caminho.`,
    );
  }

  const componentCode = fs.readFileSync(TARGET_FILE, "utf8");
  let currentTestCode = "";
  let lastError = "";
  let success = false;
  let attempt = 1;

  while (!success && attempt <= MAX_ATTEMPTS) {
    console.log(
      `\n🔄 [Tentativa ${attempt}/${MAX_ATTEMPTS}] Gerando/Corrigindo testes para ${TARGET_FILE}...`,
    );

    const prompt = `
      Você é um agente autônomo de QA focado em React/TypeScript e Jest.
      Seu objetivo é criar um arquivo de teste (.spec.tsx) para o componente abaixo.
      
      REGRAS:
      1. Use '@testing-library/react'.
      2. O JSON de saída deve ter a chave "code" contendo o código do teste.
      3. IMPORTANTE: O componente usa setInterval. Ao usar jest.useFakeTimers(), OBRIGATORIAMENTE envolva os comandos como jest.advanceTimersByTime() dentro de um act(() => { ... }) para evitar o erro "was not wrapped in act(...)".
      4. O Jest/JSDOM não processa o CSS do Tailwind. Para verificar se um elemento está invisível (como o tooltip), use .toHaveClass('opacity-0') em vez de .not.toBeVisible().
      5. O modal de Configurações só abre se o usuário estiver logado. Garanta que o mockUseUser retorne { user: { id: '123' } } antes de tentar clicar em "Settings" e abrir o modal.
      Código do Componente:
      ${componentCode}

      ${lastError ? `🚨 ERRO NA TENTATIVA ANTERIOR QUE VOCÊ DEVE CORRIGIR:\n${lastError}\n\nTeste que falhou:\n${currentTestCode}` : ""}
    `;

    try {
      const resultAPI = await model.generateContent(prompt);
      let resultText = resultAPI.response.text();

      resultText = resultText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const result = JSON.parse(resultText);

      if (!result.code) throw new Error("IA não retornou o código.");

      currentTestCode = result.code;
      fs.writeFileSync(SPEC_FILE, currentTestCode);
      console.log(`💾 Teste salvo. Executando Verifier (yarn test)...`);

      // O Verifier: Roda o Jest focando apenas neste arquivo
      execSync(`yarn test ${SPEC_FILE} --watchAll=false`, { stdio: "pipe" });

      console.log(`✅ SUCESSO! O teste rodou sem erros no Jest.`);
      success = true;
    } catch (error: any) {
      // Captura tanto a saída normal quanto a saída de erro do terminal
      const out = error.stdout ? error.stdout.toString() : "";
      const err = error.stderr ? error.stderr.toString() : "";

      // Junta tudo para não perdermos nenhum detalhe
      lastError = out || err ? `${out}\n${err}` : error.message;

      console.log(`\n🚨 --- ERRO REAL DO JEST --- 🚨`);
      console.log(lastError);

      console.log(
        `❌ Falha detectada pelo Jest. O Gemini vai ler o erro e tentar novamente.`,
      );
      attempt++;
    }
  }

  if (!success) {
    console.log(
      `🛑 Limite de tentativas atingido. O Agente não conseguiu resolver.`,
    );
    if (fs.existsSync(SPEC_FILE)) fs.unlinkSync(SPEC_FILE);
  }
}

runAgent();
