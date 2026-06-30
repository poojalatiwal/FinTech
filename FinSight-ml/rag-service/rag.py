from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

from mongodb import expenses, budgets

# ==========================================
# LOAD EMBEDDING MODEL
# ==========================================

print("Loading Embedding Model...")

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

print("Embedding Model Loaded.")

# ==========================================
# BUILD USER DOCUMENTS
# ==========================================

def build_documents(user_id: str):

    documents = []

    # --------------------------------------
    # Expenses
    # --------------------------------------

    expense_list = list(
        expenses.find(
            {
                "userId": user_id
            }
        )
    )

    for expense in expense_list:

        documents.append({

            "type": "expense",

            "content": f"""
Expense

Title : {expense.get("title","")}

Category : {expense.get("category","")}

Amount : ₹{expense.get("amount",0)}

Description : {expense.get("description","")}

Date : {expense.get("date","")}
"""
        })

    # --------------------------------------
    # Budgets
    # --------------------------------------

    budget_list = list(
        budgets.find(
            {
                "userId": user_id
            }
        )
    )

    for budget in budget_list:

        documents.append({

            "type": "budget",

            "content": f"""
Budget

Category : {budget.get("category","")}

Limit Amount : ₹{budget.get("limitAmount",0)}

Month : {budget.get("month","")}
"""
        })

    return documents


# ==========================================
# CREATE TEMPORARY FAISS INDEX
# ==========================================

def create_index(documents):

    if len(documents) == 0:

        return None, None

    texts = [

        doc["content"]

        for doc in documents

    ]

    embeddings = embedding_model.encode(

        texts,

        convert_to_numpy=True,

        normalize_embeddings=True

    )

    embeddings = np.asarray(
        embeddings,
        dtype=np.float32
    )

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatIP(dimension)

    index.add(
        embeddings
    )

    return index, documents


# ==========================================
# RETRIEVE CONTEXT
# ==========================================

def retrieve_context(
    user_id: str,
    question: str,
    top_k: int = 5
):

    documents = build_documents(
        user_id
    )

    if len(documents) == 0:

        return ""

    index, documents = create_index(
        documents
    )

    query_embedding = embedding_model.encode(

        [question],

        convert_to_numpy=True,

        normalize_embeddings=True

    )

    query_embedding = np.asarray(
        query_embedding,
        dtype=np.float32
    )

    scores, ids = index.search(
        query_embedding,
        top_k
    )

    context = ""

    print("\nRetrieved Documents\n")

    for score, idx in zip(
        scores[0],
        ids[0]
    ):

        if idx == -1:
            continue

        if score < 0.35:
            continue

        doc = documents[idx]

        print(
            doc["type"],
            score
        )

        context += f"""

{doc["content"]}

"""

    return context