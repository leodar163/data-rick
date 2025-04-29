import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "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",
});

const completion = openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
        {"role": "user", "content": "write a haiku about ai"},
    ],
});

completion.then((result) => console.log(result.choices[0].message));