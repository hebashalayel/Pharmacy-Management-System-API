# Auto-Patch Test Repository

هذا المستودع مخصص لاختبار مشروع التخرج **Auto-Patch**.

## مثال لكود غير آمن (للاختبار):

سيقوم الذكاء الاصطناعي بتحليل الكود التالي واكتشاف الثغرة الأمنية فيه:

```javascript
const express = require('express');
const mysql = require('mysql');
const app = express();
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  db.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(3000);


