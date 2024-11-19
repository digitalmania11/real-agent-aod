

#### 1. **Get Training Materials**
**Endpoint:** `GET /api/lms/training-materials`  
**Body Format:** None (No body required).  
**Response:**
```json
{
  "success": true,
  "materials": [
    {
      "_id": "materialId",
      "title": "Material Title",
      "description": "Material Description",
      "type": "video | guide | faq | article",
      "contentUrl": "URL to the material"
    }
  ]
}
```

---

#### 2. **Add Training Material**
**Endpoint:** `POST /api/lms/training-materials`  
**Body Format:**
```json
{
  "title": "Material Title",
  "description": "Material Description",
  "type": "video | guide | faq | article",
  "contentUrl": "URL to the material"
}
```
**Response:**
```json
{
  "success": true,
  "material": {
    "_id": "materialId",
    "title": "Material Title",
    "description": "Material Description",
    "type": "video | guide | faq | article",
    "contentUrl": "URL to the material"
  }
}
```

---

#### 3. **Get Quizzes**
**Endpoint:** `GET /api/lms/quizzes`  
**Body Format:** None (No body required).  
**Response:**
```json
{
  "success": true,
  "quizzes": [
    {
      "_id": "quizId",
      "title": "Quiz Title",
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A"
        }
      ],
      "passingScore": 7
    }
  ]
}
```

---

#### 4. **Add Quiz**
**Endpoint:** `POST /api/lms/quizzes`  
**Body Format:**
```json
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ],
  "passingScore": 7
}
```
**Response:**
```json
{
  "success": true,
  "quiz": {
    "_id": "quizId",
    "title": "Quiz Title",
    "questions": [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A"
      }
    ],
    "passingScore": 7
  }
}
```

---

#### 5. **Submit Quiz**
**Endpoint:** `POST /api/lms/quizzes/:quizId/submit`  
**Body Format:**
```json
{
  "agentId": "agentId",
  "answers": ["Option A", "Option B", "Option D", "Option C"]
}
```
**Response:**
```json
{
  "success": true,
  "score": 8,
  "passed": true
}
```

---

#### 6. **Get Agent Status**
**Endpoint:** `GET /api/lms/agents/:agentId/status`  
**Body Format:** None (No body required).  
**Response:**
```json
{
  "success": true,
  "isOnboarded": true
}
```

---

### Notes
- For `POST` operations, the `Content-Type` should be `application/json`.
- The `agentId`, `quizId`, or other identifiers should be passed as path parameters (e.g., `/api/lms/agents/:agentId/status`) or included in the request body as needed.