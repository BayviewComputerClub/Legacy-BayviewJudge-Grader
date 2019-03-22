#include <iostream>
using namespace std;
int main()
{
   // printf() displays the string inside quotation
   int i = 0;
   cin >> i;

   for(int  x = 0; x < i; x++) {
        int a;
        int b;
        cin >> a;
        cin >> b;
        cout << a+b << endl;
   }
   return 0;
}