from sentence_transformers import SentenceTransformer
import faiss
import os
import pickle

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

documents = []

for file in os.listdir(
        "financial_docs"
):
    with open(
            f"financial_docs/{file}",
            "r"
    ) as f:

        documents.append(
            f.read()
        )

embeddings = model.encode(
    documents
)

index = faiss.IndexFlatL2(
    embeddings.shape[1]
)

index.add(
    embeddings
)

faiss.write_index(
    index,
    "faiss_index/index.bin"
)

with open(
        "faiss_index/docs.pkl",
        "wb"
) as f:

    pickle.dump(
        documents,
        f
    )

print("Index Created")