# ⚖️ DoJ-Chatbot (Department of Justice AI Assistant)

![GitHub last commit](https://img.shields.io/github/last-commit/Pratz1337/DoJ-Chatbot)
![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![Stack](https://img.shields.io/badge/AI-RAG%20Pipeline-orange)
![License](https://img.shields.io/badge/License-MIT-green)

> **Democratizing access to legal information through Generative AI.**

## 📖 Overview

The **DoJ-Chatbot** is an AI-powered conversational assistant designed to bridge the gap between complex legal terminology and the general public. Built to support the mission of the Department of Justice, this tool leverages **Large Language Models (LLMs)** and **Retrieval-Augmented Generation (RAG)** to provide accurate, context-aware answers regarding the Indian Constitution, BNS (Bharatiya Nyaya Sanhita), and legal procedures.



## ✨ Key Features

* **🤖 Intelligent Legal Query Resolution:** specialized in answering queries related to Indian Law, IPC/BNS sections, and court procedures.
* **📚 RAG Pipeline:** Fetches real-time context from a vector database of legal documents to reduce hallucinations.
* **🗣️ Multilingual Support:** (Planned/Implemented) Supports interaction in English and Hindi to cater to a wider demographic.
* **📄 Document Analysis:** Users can upload legal notices or documents for summarization and simplification.
* **🔒 Secure & Private:** Designed with data privacy principles suitable for sensitive legal inquiries.

## 🛠️ Tech Stack

### AI & Backend
* **Language:** Python
* **Framework:** FastAPI / Flask
* **LLM Orchestration:** LangChain / LlamaIndex
* **Embeddings:** HuggingFace / OpenAI Embeddings
* **Vector Database:** FAISS / ChromaDB / Pinecone
* **Model:** GPT-4o / Llama-3 / Gemini

### Frontend
* **Framework:** Next.js / React
* **Styling:** Tailwind CSS
* **State Management:** Redux / Context API

## 🏗️ Architecture

```mermaid
graph TD
    A[User Query] --> B[Frontend UI]
    B --> C{API Gateway}
    C --> D[Embedding Model]
    D --> E[(Vector Database)]
    E -- Retrieved Context --> F[LLM: Context + Query]
    F --> G[Generated Legal Response]
    G --> B
