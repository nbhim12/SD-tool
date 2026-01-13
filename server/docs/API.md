# IGBC Green Homes Tool - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Health Check

#### GET /api/health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "IGBC Tool API is running",
  "timestamp": "2026-01-13T10:00:00.000Z"
}
```

---

### Categories

#### GET /api/categories
Get all IGBC categories with credits and mandatory requirements.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sd",
      "code": "SD",
      "name": "Sustainable Design",
      "possiblePoints": 20,
      "mandatoryRequirements": [...],
      "credits": [...]
    },
    ...
  ],
  "meta": {
    "totalCategories": 6,
    "totalPossiblePoints": 100,
    "certificationLevels": [...]
  }
}
```

#### GET /api/categories/certification-levels
Get certification levels and point thresholds.

**Response:**
```json
{
  "success": true,
  "data": [
    { "level": "certified", "minPoints": 40, "maxPoints": 49, "label": "Certified" },
    { "level": "silver", "minPoints": 50, "maxPoints": 59, "label": "Silver" },
    { "level": "gold", "minPoints": 60, "maxPoints": 74, "label": "Gold" },
    { "level": "platinum", "minPoints": 75, "maxPoints": 100, "label": "Platinum" }
  ],
  "totalPossiblePoints": 100
}
```

#### GET /api/categories/:code
Get a single category by code.

**Parameters:**
- `code` - Category code (SD, WC, EE, MR, RHW, ID)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sd",
    "code": "SD",
    "name": "Sustainable Design",
    "possiblePoints": 20,
    "mandatoryRequirements": [
      { "id": "sd-mr-1", "code": "SD MR 1", "name": "Local Building Regulations" },
      ...
    ],
    "credits": [
      { "id": "sd-cr-1", "code": "SD Credit 1", "name": "Natural Topography & Vegetation", "maxPoints": 4 },
      ...
    ]
  }
}
```

---

### Scenarios

#### GET /api/scenarios
Get all scenarios (list view).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Project Alpha",
      "projectName": "Green Tower",
      "projectType": "Apartment",
      "targetCertificationLevel": "gold",
      "createdAt": "2026-01-13T10:00:00.000Z",
      "updatedAt": "2026-01-13T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### GET /api/scenarios/:id
Get a single scenario with full details.

**Parameters:**
- `id` - Scenario MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Project Alpha",
    "projectName": "Green Tower",
    "projectType": "Apartment",
    "targetCertificationLevel": "gold",
    "categories": [
      {
        "categoryCode": "SD",
        "mandatoryCompliance": [
          { "requirementId": "sd-mr-1", "isCompliant": true, "notes": "Approved" }
        ],
        "creditDistributions": [
          { "creditId": "sd-cr-1", "yesPoints": 2, "maybePoints": 1, "noPoints": 1, "notes": "" }
        ]
      },
      ...
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### POST /api/scenarios
Create a new scenario.

**Request Body:**
```json
{
  "name": "Project Alpha",
  "projectName": "Green Tower",
  "projectType": "Apartment",
  "targetCertificationLevel": "gold"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Scenario created successfully"
}
```

#### PUT /api/scenarios/:id
Update a scenario.

**Parameters:**
- `id` - Scenario MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Updated Name",
  "projectName": "Updated Project",
  "targetCertificationLevel": "platinum",
  "categories": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Scenario updated successfully"
}
```

#### DELETE /api/scenarios/:id
Delete a scenario.

**Parameters:**
- `id` - Scenario MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "message": "Scenario deleted successfully"
}
```

#### PUT /api/scenarios/:id/categories/:categoryCode
Update a specific category within a scenario.

**Parameters:**
- `id` - Scenario MongoDB ObjectId
- `categoryCode` - Category code (SD, WC, EE, MR, RHW, ID)

**Request Body:**
```json
{
  "mandatoryCompliance": [
    { "requirementId": "sd-mr-1", "isCompliant": true, "notes": "Verified" }
  ],
  "creditDistributions": [
    { "creditId": "sd-cr-1", "yesPoints": 4, "maybePoints": 0, "noPoints": 0, "notes": "Full points" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Category updated successfully"
}
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error
