import unittest
from app import create_app

class TestPing(unittest.TestCase):
    def setUp(self):
        self.app = create_app().test_client()

    def test_ping(self):
        response = self.app.get('/ping')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode(), 'pong')

if __name__ == '__main__':
    unittest.main()