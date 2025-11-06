// code_map_50.js — Part 1/3
// Add Parts 2 & 3 entries BEFORE the final `};`

module.exports = {
  // ========== ARRAYS (5) ==========
  "Two Sum": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> twoSum(vector<int>& a, int target){
  unordered_map<int,int> pos;
  for(int i=0;i<(int)a.size();++i){
    int need = target - a[i];
    if(pos.count(need)) return {pos[need], i};
    pos[a[i]] = i;
  }
  return {-1};
}`,
    java: `import java.util.*;
class Sol {
  int[] twoSum(int[] a, int target){
    Map<Integer,Integer> pos = new HashMap<>();
    for(int i=0;i<a.length;i++){
      int need = target - a[i];
      if(pos.containsKey(need)) return new int[]{pos.get(need), i};
      pos.put(a[i], i);
    }
    return new int[]{-1};
  }
}`,
    py: `def two_sum(a, target):
    pos = {}
    for i, x in enumerate(a):
        need = target - x
        if need in pos:
            return [pos[need], i]
        pos[x] = i
    return [-1]`
  },

  "Kadane Maximum Subarray Sum": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
long long kadane(const vector<long long>& a){
  long long cur = a[0], best = a[0];
  for(size_t i=1;i<a.size();++i){
    cur = max(a[i], cur + a[i]);
    best = max(best, cur);
  }
  return best;
}`,
    java: `class Sol {
  int kadane(int[] a){
    long cur = a[0], best = a[0];
    for(int i=1;i<a.length;i++){
      cur = Math.max(a[i], cur + a[i]);
      best = Math.max(best, cur);
    }
    return (int)best;
  }
}`,
    py: `def kadane(a):
    cur = best = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`
  },

  "Move Zeroes": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
void moveZeroes(vector<int>& a){
  int w = 0;
  for(int x : a) if(x) a[w++] = x;
  while(w < (int)a.size()) a[w++] = 0;
}`,
    java: `class Sol {
  void moveZeroes(int[] a){
    int w = 0;
    for(int x : a) if(x != 0) a[w++] = x;
    while(w < a.length) a[w++] = 0;
  }
}`,
    py: `def move_zeroes(a):
    w = 0
    for x in a:
        if x:
            a[w] = x
            w += 1
    while w < len(a):
        a[w] = 0
        w += 1`
  },

  "Sort Colors": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
void sortColors(vector<int>& a){
  int l=0, m=0, h=(int)a.size()-1;
  while(m<=h){
    if(a[m]==0) swap(a[l++], a[m++]);
    else if(a[m]==2) swap(a[m], a[h--]);
    else m++;
  }
}`,
    java: `class Sol {
  void sortColors(int[] a){
    int l=0, m=0, h=a.length-1;
    while(m<=h){
      if(a[m]==0){ int t=a[l]; a[l]=a[m]; a[m]=t; l++; m++; }
      else if(a[m]==2){ int t=a[m]; a[m]=a[h]; a[h]=t; h--; }
      else m++;
    }
  }
}`,
    py: `def sort_colors(a):
    l = m = 0
    h = len(a) - 1
    while m <= h:
        if a[m] == 0:
            a[l], a[m] = a[m], a[l]
            l += 1; m += 1
        elif a[m] == 2:
            a[m], a[h] = a[h], a[m]
            h -= 1
        else:
            m += 1`
  },

  "Majority Element": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int majorityElement(const vector<int>& a){
  int cnt=0, cand=0;
  for(int x: a){
    if(cnt==0){ cand=x; cnt=1; }
    else cnt += (x==cand)?1:-1;
  }
  return cand;
}`,
    java: `class Sol {
  int majorityElement(int[] a){
    int cnt=0, cand=0;
    for(int x : a){
      if(cnt==0){ cand=x; cnt=1; }
      else cnt += (x==cand)?1:-1;
    }
    return cand;
  }
}`,
    py: `def majority_element(a):
    cnt = 0
    cand = None
    for x in a:
        if cnt == 0:
            cand = x; cnt = 1
        else:
            cnt += 1 if x == cand else -1
    return cand`
  },

  // ========== BINARY SEARCH (5) ==========
  "Search Insert Position": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int searchInsert(const vector<int>& a, int t){
  int l=0, r=(int)a.size();
  while(l<r){
    int m=(l+r)/2;
    if(a[m]<t) l=m+1; else r=m;
  }
  return l;
}`,
    java: `class Sol {
  int searchInsert(int[] a, int t){
    int l=0, r=a.length;
    while(l<r){
      int m=(l+r)/2;
      if(a[m]<t) l=m+1; else r=m;
    }
    return l;
  }
}`,
    py: `def search_insert(a, t):
    l, r = 0, len(a)
    while l < r:
        m = (l + r) // 2
        if a[m] < t:
            l = m + 1
        else:
            r = m
    return l`
  },

  "Find Minimum in Rotated Sorted Array": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int findMin(const vector<int>& a){
  int l=0, r=(int)a.size()-1;
  while(l<r){
    int m=(l+r)/2;
    if(a[m] > a[r]) l=m+1; else r=m;
  }
  return a[l];
}`,
    java: `class Sol {
  int findMin(int[] a){
    int l=0, r=a.length-1;
    while(l<r){
      int m=(l+r)/2;
      if(a[m] > a[r]) l=m+1; else r=m;
    }
    return a[l];
  }
}`,
    py: `def find_min(a):
    l, r = 0, len(a)-1
    while l < r:
        m = (l + r) // 2
        if a[m] > a[r]:
            l = m + 1
        else:
            r = m
    return a[l]`
  },

  "Kth Missing Positive Number": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int kthMissing(const vector<int>& a, int k){
  int l=0, r=(int)a.size()-1, ans=(int)a.size()+k;
  while(l<=r){
    int m=(l+r)/2;
    int miss = a[m] - (m+1);
    if(miss < k) l=m+1;
    else { ans = a[m] - (miss - k); r=m-1; }
  }
  return ans;
}`,
    java: `class Sol {
  int kthMissing(int[] a, int k){
    int l=0, r=a.length-1, ans=a.length+k;
    while(l<=r){
      int m=(l+r)/2;
      int miss = a[m] - (m+1);
      if(miss < k) l=m+1;
      else { ans = a[m] - (miss - k); r=m-1; }
    }
    return ans;
  }
}`,
    py: `def kth_missing(a, k):
    l, r = 0, len(a)-1
    ans = len(a) + k
    while l <= r:
        m = (l + r) // 2
        miss = a[m] - (m + 1)
        if miss < k:
            l = m + 1
        else:
            ans = a[m] - (miss - k)
            r = m - 1
    return ans`
  },

  "Peak Index in Mountain Array": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int peakIndexInMountainArray(const vector<int>& a){
  int l=0, r=(int)a.size()-1;
  while(l<r){
    int m=(l+r)/2;
    if(a[m] < a[m+1]) l=m+1; else r=m;
  }
  return l;
}`,
    java: `class Sol {
  int peakIndexInMountainArray(int[] a){
    int l=0, r=a.length-1;
    while(l<r){
      int m=(l+r)/2;
      if(a[m] < a[m+1]) l=m+1; else r=m;
    }
    return l;
  }
}`,
    py: `def peak_index(a):
    l, r = 0, len(a)-1
    while l < r:
      m = (l + r) // 2
      if a[m] < a[m+1]:
          l = m + 1
      else:
          r = m
    return l`
  },

  "Allocate Books": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
static bool ok(const vector<int>& a, int students, long long mx){
  long long cur=0; int cnt=1;
  for(int x : a){
    if(x > mx) return false;
    if(cur + x > mx){ cnt++; cur = x; }
    else cur += x;
  }
  return cnt <= students;
}
long long allocateBooks(const vector<int>& a, int students){
  long long l=0, r=0; for(int x:a) r += x;
  long long ans = r;
  while(l<=r){
    long long m = (l+r)/2;
    if(ok(a, students, m)){ ans=m; r=m-1; }
    else l=m+1;
  }
  return ans;
}`,
    java: `class Sol {
  boolean ok(int[] a, int s, long mx){
    long cur=0; int cnt=1;
    for(int x : a){
      if(x > mx) return false;
      if(cur + x > mx){ cnt++; cur = x; }
      else cur += x;
    }
    return cnt <= s;
  }
  long allocateBooks(int[] a, int s){
    long l=0, r=0;
    for(int x : a) r += x;
    long ans = r;
    while(l<=r){
      long m = (l+r)/2;
      if(ok(a, s, m)){ ans=m; r=m-1; }
      else l=m+1;
    }
    return ans;
  }
}`,
    py: `def _ok(a, s, mx):
    cur = 0
    cnt = 1
    for x in a:
        if x > mx:
            return False
        if cur + x > mx:
            cnt += 1
            cur = x
        else:
            cur += x
    return cnt <= s

def allocate_books(a, s):
    l, r = 0, sum(a)
    ans = r
    while l <= r:
        m = (l + r) // 2
        if _ok(a, s, m):
            ans = m
            r = m - 1
        else:
            l = m + 1
    return ans`
  },

  // ========== STRINGS (5) ==========
  "Valid Parenthesis String": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
bool checkValidString(const string& s){
  int lo=0, hi=0;
  for(char c: s){
    if(c=='('){ lo++; hi++; }
    else if(c==')'){ lo=max(0,lo-1); hi--; }
    else { lo=max(0,lo-1); hi++; } // '*'
    if(hi<0) return false;
  }
  return lo==0;
}`,
    java: `class Sol {
  boolean checkValidString(String s){
    int lo=0, hi=0;
    for(char c: s.toCharArray()){
      if(c=='('){ lo++; hi++; }
      else if(c==')'){ lo = Math.max(0,lo-1); hi--; }
      else { lo = Math.max(0,lo-1); hi++; }
      if(hi<0) return false;
    }
    return lo==0;
  }
}`,
    py: `def check_valid_string(s):
    lo = hi = 0
    for c in s:
        if c == '(':
            lo += 1; hi += 1
        elif c == ')':
            lo = max(0, lo-1); hi -= 1
        else:
            lo = max(0, lo-1); hi += 1
        if hi < 0:
            return False
    return lo == 0`
  },

  "Is Subsequence": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
bool isSubsequence(const string& s, const string& t){
  int i=0;
  for(char c : t) if(i<(int)s.size() && s[i]==c) i++;
  return i==(int)s.size();
}`,
    java: `class Sol {
  boolean isSubsequence(String s, String t){
    int i=0;
    for(char c: t.toCharArray()) if(i<s.length() && s.charAt(i)==c) i++;
    return i==s.length();
  }
}`,
    py: `def is_subsequence(s, t):
    i = 0
    for c in t:
        if i < len(s) and s[i] == c:
            i += 1
    return i == len(s)`
  },

  "Longest Palindromic Substring": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
string longestPalindrome(const string& s){
  int n=s.size(), bi=0, bl=1;
  auto exp = [&](int l,int r){
    while(l>=0&&r<n&&s[l]==s[r]){
      if(r-l+1>bl){ bl=r-l+1; bi=l; }
      l--; r++;
    }
  };
  for(int i=0;i<n;i++){ exp(i,i); exp(i,i+1); }
  return s.substr(bi,bl);
}`,
    java: `class Sol {
  String longestPalindrome(String s){
    int n=s.length(), bi=0, bl=1;
    for(int i=0;i<n;i++){
      int l=i, r=i;
      while(l>=0 && r<n && s.charAt(l)==s.charAt(r)){
        if(r-l+1>bl){ bl=r-l+1; bi=l; }
        l--; r++;
      }
      l=i; r=i+1;
      while(l>=0 && r<n && s.charAt(l)==s.charAt(r)){
        if(r-l+1>bl){ bl=r-l+1; bi=l; }
        l--; r++;
      }
    }
    return s.substring(bi, bi+bl);
  }
}`,
    py: `def longest_palindrome(s):
    n = len(s)
    if n <= 1: return s
    bi, bl = 0, 1
    def exp(l, r):
        nonlocal bi, bl
        while l>=0 and r<n and s[l]==s[r]:
            if r-l+1 > bl:
                bl = r-l+1; bi = l
            l -= 1; r += 1
    for i in range(n):
        exp(i, i)
        exp(i, i+1)
    return s[bi:bi+bl]`
  },

  "Remove Adjacent Duplicates": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
string removeDuplicates(string s){
  string t;
  for(char c: s){
    if(!t.empty() && t.back()==c) t.pop_back();
    else t.push_back(c);
  }
  return t;
}`,
    java: `class Sol {
  String removeDuplicates(String s){
    StringBuilder t = new StringBuilder();
    for(char c: s.toCharArray()){
      int L=t.length();
      if(L>0 && t.charAt(L-1)==c) t.deleteCharAt(L-1);
      else t.append(c);
    }
    return t.toString();
  }
}`,
    py: `def remove_adjacent_duplicates(s):
    st = []
    for c in s:
        if st and st[-1] == c:
            st.pop()
        else:
            st.append(c)
    return ''.join(st)`
  },

  "Longest Repeating Character Replacement": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int characterReplacement(string s, int k){
  int f[26]={0}, mx=0, l=0, best=0;
  for(int r=0;r<(int)s.size();++r){
    mx = max(mx, ++f[s[r]-'A']);
    while(r-l+1 - mx > k){ f[s[l]-'A']--; l++; }
    best = max(best, r-l+1);
  }
  return best;
}`,
    java: `class Sol {
  int characterReplacement(String s, int k){
    int[] f = new int[26];
    int mx=0, l=0, best=0;
    for(int r=0;r<s.length();r++){
      mx = Math.max(mx, ++f[s.charAt(r)-'A']);
      while(r-l+1 - mx > k){
        f[s.charAt(l)-'A']--; l++;
      }
      best = Math.max(best, r-l+1);
    }
    return best;
  }
}`,
    py: `def character_replacement(s, k):
    f = [0]*26
    mx = l = best = 0
    for r, ch in enumerate(s):
        i = ord(ch) - 65
        f[i] += 1
        mx = max(mx, f[i])
        while r - l + 1 - mx > k:
            f[ord(s[l]) - 65] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best`
  },

    // ========== LINKED LIST (5) ==========
  "Add Two Numbers Linked List": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode { int val; ListNode *next; };
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2){
  ListNode dummy; ListNode* cur = &dummy;
  int carry = 0;
  while(l1 || l2 || carry){
    int s = carry;
    if(l1) s += l1->val, l1 = l1->next;
    if(l2) s += l2->val, l2 = l2->next;
    carry = s/10;
    cur->next = new ListNode{ s%10, nullptr };
    cur = cur->next;
  }
  return dummy.next;
}`,
    java: `class ListNode { int val; ListNode next; }
class Sol {
  ListNode addTwoNumbers(ListNode l1, ListNode l2){
    ListNode dummy = new ListNode();
    ListNode cur = dummy;
    int carry = 0;
    while(l1 != null || l2 != null || carry != 0){
      int s = carry;
      if(l1 != null){ s += l1.val; l1 = l1.next; }
      if(l2 != null){ s += l2.val; l2 = l2.next; }
      carry = s/10;
      cur.next = new ListNode();
      cur = cur.next; cur.val = s%10;
    }
    return dummy.next;
  }
}`,
    py: `class ListNode: 
    def __init__(self,val=0,next=None): self.val=val; self.next=next

def add_two_numbers(l1,l2):
    dummy = ListNode()
    cur = dummy; carry = 0
    while l1 or l2 or carry:
        s = carry
        if l1: s += l1.val; l1=l1.next
        if l2: s += l2.val; l2=l2.next
        carry = s//10
        cur.next = ListNode(s%10); cur = cur.next
    return dummy.next`
  },

  "Remove Duplicates Unsorted Linked List": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{ int val; ListNode* next; };
ListNode* removeDup(ListNode* head){
  unordered_set<int> seen;
  ListNode dummy{0,head}, *p=&dummy;
  while(p->next){
    if(seen.count(p->next->val)) p->next = p->next->next;
    else{ seen.insert(p->next->val); p=p->next; }
  }
  return dummy.next;
}`,
    java: `import java.util.*;
class ListNode { int val; ListNode next; }
class Sol {
  ListNode removeDup(ListNode head){
    Set<Integer> st = new HashSet<>();
    ListNode dummy = new ListNode(), p = dummy; dummy.next=head;
    while(p.next != null){
      if(st.contains(p.next.val)) p.next = p.next.next;
      else { st.add(p.next.val); p = p.next; }
    }
    return dummy.next;
  }
}`,
    py: `def remove_dup(head):
    st=set(); dummy=ListNode(0,head); p=dummy
    while p.next:
        if p.next.val in st: p.next=p.next.next
        else: st.add(p.next.val); p=p.next
    return dummy.next`
  },

  "Intersection of Two Linked Lists": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{ int val; ListNode* next; };
ListNode* getIntersectionNode(ListNode* A, ListNode* B){
  ListNode *a=A, *b=B;
  while(a!=b){
    a = a? a->next : B;
    b = b? b->next : A;
  }
  return a;
}`,
    java: `class ListNode{ int val; ListNode next; }
class Sol{
  ListNode getIntersectionNode(ListNode A, ListNode B){
    ListNode a=A, b=B;
    while(a!=b){
      a = (a!=null)? a.next:B;
      b = (b!=null)? b.next:A;
    }
    return a;
  }
}`,
    py: `def intersection_node(a,b):
    A,B=a,b
    while A!=B:
        A=A.next if A else b
        B=B.next if B else a
    return A`
  },

  "Odd Even Linked List": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{ int val; ListNode* next; };
ListNode* oddEvenList(ListNode* h){
  if(!h||!h->next) return h;
  ListNode *o=h,*e=h->next,*eh=e;
  while(e && e->next){
    o->next=e->next; o=o->next;
    e->next=o->next; e=e->next;
  }
  o->next=eh;
  return h;
}`,
    java: `class Sol {
  ListNode oddEvenList(ListNode h){
    if(h==null||h.next==null) return h;
    ListNode o=h,e=h.next,eh=e;
    while(e!=null && e.next!=null){
      o.next=e.next; o=o.next;
      e.next=o.next; e=e.next;
    }
    o.next=eh;
    return h;
  }
}`,
    py: `def odd_even_list(h):
    if not h or not h.next: return h
    o,e=h,h.next; eh=e
    while e and e.next:
        o.next=e.next; o=o.next
        e.next=o.next; e=e.next
    o.next=eh; return h`
  },

  "Copy List with Random Pointer": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct Node{ int val; Node *next,*random; };
Node* copyRandomList(Node* h){
  if(!h) return h;
  for(Node* c=h;c;c=c->next->next){
    Node* n=new Node{c->val,c->next,nullptr};
    c->next=n;
  }
  for(Node* c=h;c;c=c->next->next)
    if(c->random) c->next->random=c->random->next;
  Node* nh=h->next;
  for(Node* c=h;c;c=c->next){
    Node* n=c->next;
    c->next=n->next;
    if(n->next) n->next=n->next->next;
  }
  return nh;
}`,
    java: `class Node{ int val; Node next,random; }
class Sol {
  Node copyRandomList(Node h){
    if(h==null) return null;
    for(Node c=h;c!=null;c=c.next.next){
      Node n=new Node(); n.val=c.val; n.next=c.next; c.next=n;
    }
    for(Node c=h;c!=null;c=c.next.next)
      if(c.random!=null) c.next.random=c.random.next;
    Node nh=h.next;
    for(Node c=h;c!=null;c=c.next){
      Node n=c.next; c.next=n.next;
      if(n.next!=null) n.next=n.next.next;
    }
    return nh;
  }
}`,
    py: `class Node:
    def __init__(self,val=0,next=None,random=None):
        self.val=val; self.next=next; self.random=random

def copy_random_list(h):
    if not h: return h
    c=h
    while c:
        n=Node(c.val,c.next)
        c.next=n; c=n.next
    c=h
    while c:
        if c.random: c.next.random = c.random.next
        c=c.next.next
    nh=h.next; c=h
    while c:
        n=c.next; c.next=n.next
        if n.next: n.next=n.next.next
        c=c.next
    return nh`
  },


  // ========== BACKTRACKING (5) ==========
  "N Queens": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<string>> sol;
vector<string> bd;
int n;
bool col[20], d1[40], d2[40];
void dfs(int r){
  if(r==n){ sol.push_back(bd); return; }
  for(int c=0;c<n;c++){
    if(col[c]||d1[r-c+20]||d2[r+c]) continue;
    col[c]=d1[r-c+20]=d2[r+c]=1;
    bd[r][c]='Q'; dfs(r+1); bd[r][c]='.';
    col[c]=d1[r-c+20]=d2[r+c]=0;
  }
}
vector<vector<string>> solveNQueens(int nn){
  n=nn; bd.assign(n,string(n,'.'));
  dfs(0); return sol;
}`,
    java: `import java.util.*;
class Sol {
  List<List<String>> ans = new ArrayList<>();
  boolean[] col = new boolean[20], d1 = new boolean[40], d2 = new boolean[40];
  char[][] bd;
  void dfs(int r){
    int n = bd.length;
    if(r==n){
      List<String> t = new ArrayList<>();
      for(char[] c:bd) t.add(new String(c));
      ans.add(t); return;
    }
    for(int c=0;c<n;c++){
      if(col[c]||d1[r-c+20]||d2[r+c]) continue;
      col[c]=d1[r-c+20]=d2[r+c]=true;
      bd[r][c]='Q'; dfs(r+1); bd[r][c]='.';
      col[c]=d1[r-c+20]=d2[r+c]=false;
    }
  }
  List<List<String>> solve(int n){
    bd=new char[n][n];
    for(char[] r:bd) Arrays.fill(r,'.');
    dfs(0); return ans;
  }
}`,
    py: `def solve_n_queens(n):
    bd = [['.' for _ in range(n)] for _ in range(n)]
    col = set(); d1=set(); d2=set(); ans=[]
    def dfs(r):
        if r==n:
            ans.append([''.join(x) for x in bd]); return
        for c in range(n):
            if c in col or r-c in d1 or r+c in d2: continue
            col.add(c); d1.add(r-c); d2.add(r+c)
            bd[r][c]='Q'; dfs(r+1); bd[r][c]='.'
            col.remove(c); d1.remove(r-c); d2.remove(r+c)
    dfs(0); return ans`
  },

  "Sudoku Solver": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
bool ok(vector<vector<char>>&b,int r,int c,char ch){
  for(int i=0;i<9;i++)
    if(b[r][i]==ch||b[i][c]==ch) return false;
  int sr=r/3*3, sc=c/3*3;
  for(int i=0;i<3;i++)for(int j=0;j<3;j++)
    if(b[sr+i][sc+j]==ch) return false;
  return true;
}
bool dfs(vector<vector<char>>&b){
  for(int i=0;i<9;i++)for(int j=0;j<9;j++)
    if(b[i][j]=='.'){
      for(char ch='1';ch<='9';ch++){
        if(ok(b,i,j,ch)){
          b[i][j]=ch;
          if(dfs(b)) return true;
          b[i][j]='.';
        }
      }
      return false;
    }
  return true;
}`,
    java: `class Sol {
  boolean ok(char[][]b,int r,int c,char ch){
    for(int i=0;i<9;i++)
      if(b[r][i]==ch||b[i][c]==ch) return false;
    int sr=r/3*3, sc=c/3*3;
    for(int i=0;i<3;i++)for(int j=0;j<3;j++)
      if(b[sr+i][sc+j]==ch) return false;
    return true;
  }
  boolean dfs(char[][]b){
    for(int i=0;i<9;i++)for(int j=0;j<9;j++)
      if(b[i][j]=='.'){
        for(char ch='1';ch<='9';ch++){
          if(ok(b,i,j,ch)){
            b[i][j]=ch;
            if(dfs(b)) return true;
            b[i][j]='.';
          }
        }
        return false;
      }
    return true;
  }
}`,
    py: `def solve_sudoku(b):
    def ok(r,c,ch):
        for i in range(9):
            if b[r][i]==ch or b[i][c]==ch: return False
        sr,sc = (r//3)*3,(c//3)*3
        for i in range(3):
            for j in range(3):
                if b[sr+i][sc+j]==ch: return False
        return True
    def dfs():
        for i in range(9):
            for j in range(9):
                if b[i][j] == '.':
                    for ch in '123456789':
                        if ok(i,j,ch):
                            b[i][j]=ch
                            if dfs(): return True
                            b[i][j]='.'
                    return False
        return True
    dfs()`
  },

  "Subset Sum": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> ans; vector<int> cur;
void dfs(vector<int>&a,int i,int s,int target){
  if(s==target){ ans.push_back(cur); }
  if(i==(int)a.size()||s>target) return;
  cur.push_back(a[i]);
  dfs(a,i+1,s+a[i],target);
  cur.pop_back();
  dfs(a,i+1,s,target);
}`,
    java: `import java.util.*;
class Sol {
  List<List<Integer>> ans=new ArrayList<>(), cur=new ArrayList<>();
  void dfs(int[]a,int i,int s,int t){
    if(s==t) ans.add(new ArrayList<>(cur));
    if(i==a.length || s>t) return;
    cur.add(a[i]); dfs(a,i+1,s+a[i],t); cur.remove(cur.size()-1);
    dfs(a,i+1,s,t);
  }
}`,
    py: `def subset_sum(a,target):
    ans=[]; cur=[]
    def dfs(i,s):
        if s==target: ans.append(cur[:])
        if i==len(a) or s>target: return
        cur.append(a[i]); dfs(i+1,s+a[i]); cur.pop()
        dfs(i+1,s)
    dfs(0,0); return ans`
  },

  "Permutations": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> perm(vector<int>&a){
  vector<vector<int>> ans; sort(a.begin(),a.end());
  do ans.push_back(a); while(next_permutation(a.begin(),a.end()));
  return ans;
}`,
    java: `import java.util.*;
class Sol {
  List<List<Integer>> permute(int[]a){
    List<List<Integer>> ans=new ArrayList<>();
    Arrays.sort(a); perm(a,0,ans); return ans;
  }
  void perm(int[]a,int i,List<List<Integer>>ans){
    if(i==a.length){
      List<Integer> t=new ArrayList<>();
      for(int x:a) t.add(x); ans.add(t); return;
    }
    for(int j=i;j<a.length;j++){
      int t=a[i]; a[i]=a[j]; a[j]=t;
      perm(a,i+1,ans);
      t=a[i]; a[i]=a[j]; a[j]=t;
    }
  }
}`,
    py: `def permutations(a):
    return list(__import__('itertools').permutations(a))`
  },

  "Word Search": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
bool dfs(vector<vector<char>>&b,string&w,int i,int r,int c){
  if(i==(int)w.size()) return true;
  if(r<0||c<0||r>=b.size()||c>=b[0].size()||b[r][c]!=w[i]) return false;
  char t=b[r][c]; b[r][c]='#';
  bool ok = dfs(b,w,i+1,r+1,c)||dfs(b,w,i+1,r-1,c)||dfs(b,w,i+1,r,c+1)||dfs(b,w,i+1,r,c-1);
  b[r][c]=t; return ok;
}`,
    java: `class Sol {
  boolean dfs(char[][]b,String w,int i,int r,int c){
    if(i==w.length()) return true;
    if(r<0||c<0||r>=b.length||c>=b[0].length||b[r][c]!=w.charAt(i)) return false;
    char t=b[r][c]; b[r][c]='#';
    boolean ok = dfs(b,w,i+1,r+1,c)||dfs(b,w,i+1,r-1,c)||dfs(b,w,i+1,r,c+1)||dfs(b,w,i+1,r,c-1);
    b[r][c]=t; return ok;
  }
}`,
    py: `def word_search(b,w):
    m,n=len(b),len(b[0])
    def dfs(i,r,c):
        if i==len(w): return True
        if r<0 or c<0 or r>=m or c>=n or b[r][c]!=w[i]: return False
        t=b[r][c]; b[r][c]='#'
        ok = dfs(i+1,r+1,c) or dfs(i+1,r-1,c) or dfs(i+1,r,c+1) or dfs(i+1,r,c-1)
        b[r][c]=t; return ok
    return any(dfs(0,i,j) for i in range(m) for j in range(n))`
  },


  // ========== STACK / QUEUE (5) ==========
  "Next Greater Element Circular": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> nextGreater(vector<int>&a){
  int n=a.size(); vector<int> ans(n,-1), st;
  for(int i=0;i<2*n;i++){
    while(!st.empty() && a[st.back()] < a[i%n]){
      ans[st.back()] = a[i%n]; st.pop_back();
    }
    st.push_back(i%n);
  }
  return ans;
}`,
    java: `import java.util.*;
class Sol {
  int[] nextGreater(int[]a){
    int n=a.length; int[]ans=new int[n]; Arrays.fill(ans,-1);
    Deque<Integer> st=new ArrayDeque<>();
    for(int i=0;i<2*n;i++){
      while(!st.isEmpty() && a[st.peek()]<a[i%n]) ans[st.pop()]=a[i%n];
      st.push(i%n);
    }
    return ans;
  }
}`,
    py: `def next_greater_circular(a):
    n=len(a); ans=[-1]*n; st=[]
    for i in range(2*n):
        while st and a[st[-1]]<a[i%n]:
            ans[st.pop()]=a[i%n]
        st.append(i%n)
    return ans`
  },

  "Stock Span Problem": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> stockSpan(vector<int>&a){
  vector<int> ans(a.size());
  stack<int> st;
  for(int i=0;i<a.size();i++){
    while(!st.empty() && a[st.top()]<=a[i]) st.pop();
    ans[i] = st.empty()? i+1 : i-st.top();
    st.push(i);
  }
  return ans;
}`,
    java: `import java.util.*;
class Sol {
  int[] stockSpan(int[]a){
    int[] ans=new int[a.length]; Stack<Integer> st=new Stack<>();
    for(int i=0;i<a.length;i++){
      while(!st.isEmpty() && a[st.peek()]<=a[i]) st.pop();
      ans[i]=st.isEmpty()? i+1:i-st.peek();
      st.push(i);
    }
    return ans;
  }
}`,
    py: `def stock_span(a):
    st=[]; ans=[]
    for i,x in enumerate(a):
        while st and a[st[-1]]<=x: st.pop()
        ans.append(i+1 if not st else i-st[-1])
        st.append(i)
    return ans`
  },

  "Simplify Path": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
string simplifyPath(string p){
  vector<string> st;
  string cur;
  for(int i=0;i<=p.size();i++){
    if(i==p.size()||p[i]=='/'){
      if(cur==".."){ if(!st.empty()) st.pop_back(); }
      else if(cur!="" && cur!=".") st.push_back(cur);
      cur="";
    } else cur+=p[i];
  }
  string ans="/";
  for(int i=0;i<st.size();i++){
    ans+=st[i];
    if(i+1<st.size()) ans+="/";
  }
  return ans;
}`,
    java: `import java.util.*;
class Sol {
  String simplifyPath(String p){
    Deque<String> st=new ArrayDeque<>();
    StringBuilder cur=new StringBuilder();
    for(int i=0;i<=p.length();i++){
      if(i==p.length()||p.charAt(i)=='/'){
        String s=cur.toString();
        if(s.equals("..")){ if(!st.isEmpty()) st.removeLast(); }
        else if(!s.equals("") && !s.equals(".")) st.addLast(s);
        cur.setLength(0);
      } else cur.append(p.charAt(i));
    }
    StringBuilder sb=new StringBuilder("/");
    while(!st.isEmpty()){
      sb.append(st.removeFirst());
      if(!st.isEmpty()) sb.append("/");
    }
    return sb.toString();
  }
}`,
    py: `def simplify_path(p):
    st=[]; cur=""
    for c in p+"/":
        if c=='/':
            if cur=="..":
                if st: st.pop()
            elif cur and cur!=".":
                st.append(cur)
            cur=""
        else: cur+=c
    return "/" + "/".join(st)`
  },

  "Remove K Digits": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
string removeKdigits(string s,int k){
  vector<char> st;
  for(char c:s){
    while(!st.empty() && k && st.back()>c){ st.pop_back(); k--; }
    st.push_back(c);
  }
  while(k--) st.pop_back();
  string ans(st.begin(),st.end());
  int i=0; while(i<ans.size() && ans[i]=='0') i++;
  ans = ans.substr(i);
  return ans==""?"0":ans;
}`,
    java: `class Sol {
  String removeKdigits(String s,int k){
    StringBuilder st=new StringBuilder();
    for(char c: s.toCharArray()){
      while(st.length()>0 && k>0 && st.charAt(st.length()-1)>c){
        st.deleteCharAt(st.length()-1); k--;
      }
      st.append(c);
    }
    while(k-- > 0) st.deleteCharAt(st.length()-1);
    String ans=st.toString().replaceFirst("^0+","");
    return ans.isEmpty()?"0":ans;
  }
}`,
    py: `def remove_k_digits(s,k):
    st=[]
    for c in s:
        while st and k and st[-1]>c:
            st.pop(); k-=1
        st.append(c)
    while k: st.pop(); k-=1
    ans="".join(st).lstrip("0")
    return ans if ans else "0"`
  },

  "Largest Rectangle in Histogram": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int largestRectangleArea(vector<int>&h){
  int n=h.size(); stack<int> st; long ans=0;
  for(int i=0;i<=n;i++){
    int cur = (i==n?0:h[i]);
    while(!st.empty() && cur<h[st.top()]){
      int ht=h[st.top()]; st.pop();
      int l = st.empty()? -1 : st.top();
      ans = max(ans, 1L*ht*(i-l-1));
    }
    st.push(i);
  }
  return ans;
}`,
    java: `import java.util.*;
class Sol {
  int largestRectangleArea(int[]h){
    int n=h.length; Stack<Integer> st=new Stack<>(); long ans=0;
    for(int i=0;i<=n;i++){
      int cur=(i==n?0:h[i]);
      while(!st.isEmpty() && cur<h[st.peek()]){
        int ht=h[st.pop()];
        int l=st.isEmpty()? -1:st.peek();
        ans=Math.max(ans,(long)ht*(i-l-1));
      }
      st.push(i);
    }
    return (int)ans;
  }
}`,
    py: `def largest_histogram(h):
    st=[]; ans=0
    for i in range(len(h)+1):
        cur = h[i] if i < len(h) else 0
        while st and cur < h[st[-1]]:
            ht = h[st.pop()]
            l = st[-1] if st else -1
            ans = max(ans, ht * (i - l - 1))
        st.append(i)
    return ans`
  },

  // ========== SLIDING WINDOW (5) ==========
  "Fruit Into Baskets": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int totalFruit(vector<int>&a){
  unordered_map<int,int> m;
  int l=0, best=0;
  for(int r=0;r<a.size();r++){
    m[a[r]]++;
    while(m.size()>2){
      if(--m[a[l]]==0) m.erase(a[l]);
      l++;
    }
    best=max(best,r-l+1);
  }
  return best;
}`,
    java: `import java.util.*;
class Sol {
  int totalFruit(int[]a){
    Map<Integer,Integer> m=new HashMap<>();
    int l=0,best=0;
    for(int r=0;r<a.length;r++){
      m.put(a[r],m.getOrDefault(a[r],0)+1);
      while(m.size()>2){
        m.put(a[l],m.get(a[l])-1);
        if(m.get(a[l])==0) m.remove(a[l]);
        l++;
      }
      best=Math.max(best,r-l+1);
    }
    return best;
  }
}`,
    py: `def total_fruit(a):
    from collections import defaultdict
    m=defaultdict(int); l=0; best=0
    for r,x in enumerate(a):
        m[x]+=1
        while len(m)>2:
            m[a[l]]-=1
            if m[a[l]]==0: m.pop(a[l])
            l+=1
        best=max(best,r-l+1)
    return best`
  },

  "Longest Subarray Sum K": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int longestSubarraySumK(vector<int>&a,int k){
  unordered_map<int,int> pos;
  int s=0,best=0;
  for(int i=0;i<a.size();i++){
    s+=a[i];
    if(s==k) best=i+1;
    if(pos.count(s-k)) best=max(best,i-pos[s-k]);
    if(!pos.count(s)) pos[s]=i;
  }
  return best;
}`,
    java: `import java.util.*;
class Sol {
  int longestSubarraySumK(int[]a,int k){
    Map<Integer,Integer> pos=new HashMap<>();
    int s=0,best=0;
    for(int i=0;i<a.length;i++){
      s+=a[i];
      if(s==k) best=i+1;
      if(pos.containsKey(s-k)) best=Math.max(best,i-pos.get(s-k));
      if(!pos.containsKey(s)) pos.put(s,i);
    }
    return best;
  }
}`,
    py: `def longest_subarray_sum_k(a,k):
    pos={}; s=0; best=0
    for i,x in enumerate(a):
        s+=x
        if s==k: best=i+1
        if s-k in pos: best=max(best,i-pos[s-k])
        if s not in pos: pos[s]=i
    return best`
  },

  "Subarrays with K Distinct": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int atMost(vector<int>&a,int k){
  unordered_map<int,int> m; int l=0,ans=0;
  for(int r=0;r<a.size();r++){
    m[a[r]]++;
    while(m.size()>k){
      if(--m[a[l]]==0) m.erase(a[l]);
      l++;
    }
    ans += r-l+1;
  }
  return ans;
}
int subK(vector<int>&a,int k){
  return atMost(a,k)-atMost(a,k-1);
}`,
    java: `import java.util.*;
class Sol {
  int atMost(int[]a,int k){
    Map<Integer,Integer> m=new HashMap<>(); int l=0,ans=0;
    for(int r=0;r<a.length;r++){
      m.put(a[r],m.getOrDefault(a[r],0)+1);
      while(m.size()>k){
        m.put(a[l],m.get(a[l])-1);
        if(m.get(a[l])==0) m.remove(a[l]);
        l++;
      }
      ans+=r-l+1;
    }
    return ans;
  }
  int subK(int[]a,int k){ return atMost(a,k)-atMost(a,k-1); }
}`,
    py: `def subarrays_k_distinct(a,k):
    from collections import defaultdict
    def atMost(t):
        m=defaultdict(int); l=0; ans=0
        for r,x in enumerate(a):
            m[x]+=1
            while len(m)>t:
                m[a[l]]-=1
                if m[a[l]]==0: m.pop(a[l])
                l+=1
            ans+=r-l+1
        return ans
    return atMost(k)-atMost(k-1)`
  },

  "Max Consecutive Ones III": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int longestOnes(vector<int>&a,int k){
  int l=0,z=0,best=0;
  for(int r=0;r<a.size();r++){
    if(a[r]==0) z++;
    while(z>k) if(a[l++]==0) z--;
    best=max(best,r-l+1);
  }
  return best;
}`,
    java: `class Sol {
  int longestOnes(int[]a,int k){
    int l=0,z=0,best=0;
    for(int r=0;r<a.length;r++){
      if(a[r]==0) z++;
      while(z>k) if(a[l++]==0) z--;
      best=Math.max(best,r-l+1);
    }
    return best;
  }
}`,
    py: `def max_consecutive_ones_3(a,k):
    l=z=best=0
    for r,x in enumerate(a):
        if x==0: z+=1
        while z>k:
            if a[l]==0: z-=1
            l+=1
        best=max(best,r-l+1)
    return best`
  },

  "Longest Substring with K Distinct Characters": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int longestK(const string&s,int k){
  unordered_map<char,int> m; int l=0,best=0;
  for(int r=0;r<s.size();r++){
    m[s[r]]++;
    while(m.size()>k){
      if(--m[s[l]]==0) m.erase(s[l]);
      l++;
    }
    best=max(best,r-l+1);
  }
  return best;
}`,
    java: `class Sol {
  int longestK(String s,int k){
    Map<Character,Integer> m=new HashMap<>(); int l=0,best=0;
    for(int r=0;r<s.length();r++){
      m.put(s.charAt(r),m.getOrDefault(s.charAt(r),0)+1);
      while(m.size()>k){
        m.put(s.charAt(l),m.get(s.charAt(l))-1);
        if(m.get(s.charAt(l))==0) m.remove(s.charAt(l));
        l++;
      }
      best=Math.max(best,r-l+1);
    }
    return best;
  }
}`,
    py: `def longest_k_distinct(s,k):
    from collections import defaultdict
    m=defaultdict(int); l=0; best=0
    for r,ch in enumerate(s):
        m[ch]+=1
        while len(m)>k:
            m[s[l]]-=1
            if m[s[l]]==0: m.pop(s[l])
            l+=1
        best=max(best,r-l+1)
    return best`
  },

    // ========== TREES (5) ==========
  "Lowest Common Ancestor": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{ int val; TreeNode *left,*right; };
TreeNode* LCA(TreeNode* r, TreeNode* a, TreeNode* b){
  if(!r||r==a||r==b) return r;
  TreeNode* L=LCA(r->left,a,b);
  TreeNode* R=LCA(r->right,a,b);
  if(L&&R) return r;
  return L?L:R;
}`,
    java: `class TreeNode{ int val; TreeNode left,right; }
class Sol{
  TreeNode LCA(TreeNode r,TreeNode a,TreeNode b){
    if(r==null||r==a||r==b) return r;
    TreeNode L=LCA(r.left,a,b), R=LCA(r.right,a,b);
    if(L!=null && R!=null) return r;
    return L!=null?L:R;
  }
}`,
    py: `def lca(r,a,b):
    if not r or r==a or r==b: return r
    L = lca(r.left,a,b)
    R = lca(r.right,a,b)
    if L and R: return r
    return L or R`
  },

  "Diameter of Binary Tree": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{ int val; TreeNode*left,*right; };
int best;
int dfs(TreeNode*r){
  if(!r) return 0;
  int l=dfs(r->left), rgt=dfs(r->right);
  best=max(best,l+rgt);
  return max(l,rgt)+1;
}
int diameter(TreeNode*r){
  best=0; dfs(r); return best;
}`,
    java: `class TreeNode{ int val; TreeNode left,right; }
class Sol{
  int best;
  int dfs(TreeNode r){
    if(r==null) return 0;
    int l=dfs(r.left), rt=dfs(r.right);
    best=Math.max(best,l+rt);
    return Math.max(l,rt)+1;
  }
  int diameter(TreeNode r){
    best=0; dfs(r); return best;
  }
}`,
    py: `def diameter(r):
    best=0
    def dfs(n):
        nonlocal best
        if not n: return 0
        l=dfs(n.left); rt=dfs(n.right)
        best=max(best,l+rt)
        return max(l,rt)+1
    dfs(r); return best`
  },

  "Balanced Binary Tree": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{ int val; TreeNode*left,*right; };
int dfs(TreeNode*r){
  if(!r) return 0;
  int l=dfs(r->left), rt=dfs(r->right);
  if(l==-1||rt==-1||abs(l-rt)>1) return -1;
  return max(l,rt)+1;
}
bool isBalanced(TreeNode*r){ return dfs(r)!=-1; }`,
    java: `class TreeNode{ int val; TreeNode left,right; }
class Sol{
  int dfs(TreeNode r){
    if(r==null) return 0;
    int l=dfs(r.left), rt=dfs(r.right);
    if(l==-1||rt==-1||Math.abs(l-rt)>1) return -1;
    return Math.max(l,rt)+1;
  }
  boolean isBalanced(TreeNode r){ return dfs(r)!=-1; }
}`,
    py: `def is_balanced(r):
    def dfs(n):
        if not n: return 0
        l=dfs(n.left); rt=dfs(n.right)
        if l==-1 or rt==-1 or abs(l-rt)>1: return -1
        return max(l,rt)+1
    return dfs(r)!=-1`
  },

  "Path Sum II": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{ int val; TreeNode*left,*right; };
vector<vector<int>> ans; vector<int> cur;
void dfs(TreeNode*r,int t){
  if(!r) return;
  cur.push_back(r->val);
  if(!r->left && !r->right && t==r->val) ans.push_back(cur);
  dfs(r->left,t-r->val); dfs(r->right,t-r->val);
  cur.pop_back();
}`,
    java: `import java.util.*;
class TreeNode{ int val; TreeNode left,right; }
class Sol{
  List<List<Integer>> ans=new ArrayList<>(), cur=new ArrayList<>();
  void dfs(TreeNode r,int t){
    if(r==null) return;
    cur.add(r.val);
    if(r.left==null && r.right==null && t==r.val) ans.add(new ArrayList<>(cur));
    dfs(r.left,t-r.val); dfs(r.right,t-r.val);
    cur.remove(cur.size()-1);
  }
}`,
    py: `def path_sum(r,t):
    ans=[]; cur=[]
    def dfs(n,s):
        if not n: return
        cur.append(n.val)
        if not n.left and not n.right and s==n.val:
            ans.append(cur[:])
        dfs(n.left,s-n.val); dfs(n.right,s-n.val)
        cur.pop()
    dfs(r,t); return ans`
  },

  "Zigzag Level Order Traversal": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{ int val; TreeNode*left,*right; };
vector<vector<int>> zigzag(TreeNode*r){
  if(!r) return {};
  vector<vector<int>> ans;
  queue<TreeNode*> q; q.push(r);
  bool rev=0;
  while(!q.empty()){
    int sz=q.size(); vector<int> t(sz);
    for(int i=0;i<sz;i++){
      auto *n=q.front(); q.pop();
      int idx = rev? sz-1-i : i;
      t[idx]=n->val;
      if(n->left) q.push(n->left);
      if(n->right) q.push(n->right);
    }
    rev=!rev; ans.push_back(t);
  }
  return ans;
}`,
    java: `import java.util.*;
class TreeNode{ int val; TreeNode left,right; }
class Sol{
  List<List<Integer>> zigzag(TreeNode r){
    if(r==null) return new ArrayList<>();
    List<List<Integer>> ans=new ArrayList<>();
    Queue<TreeNode> q=new ArrayDeque<>(); q.add(r);
    boolean rev=false;
    while(!q.isEmpty()){
      int sz=q.size(); Integer[] t=new Integer[sz];
      for(int i=0;i<sz;i++){
        TreeNode n=q.poll();
        int idx=rev? sz-1-i:i;
        t[idx]=n.val;
        if(n.left!=null) q.add(n.left);
        if(n.right!=null) q.add(n.right);
      }
      ans.add(Arrays.asList(t));
      rev=!rev;
    }
    return ans;
  }
}`,
    py: `def zigzag(r):
    if not r: return []
    from collections import deque
    q=deque([r]); ans=[]; rev=False
    while q:
        t=[0]*len(q)
        for i in range(len(q)):
            n=q.popleft()
            idx=len(t)-1-i if rev else i
            t[idx]=n.val
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        rev=not rev; ans.append(t)
    return ans`
  },


  // ========== GRAPHS (5) ==========
  "Number of Islands": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
void dfs(vector<vector<char>>&g,int r,int c){
  if(r<0||c<0||r>=g.size()||c>=g[0].size()||g[r][c]=='0') return;
  g[r][c]='0';
  dfs(g,r+1,c); dfs(g,r-1,c); dfs(g,r,c+1); dfs(g,r,c-1);
}`,
    java: `class Sol{
  void dfs(char[][]g,int r,int c){
    if(r<0||c<0||r>=g.length||c>=g[0].length||g[r][c]=='0') return;
    g[r][c]='0';
    dfs(g,r+1,c); dfs(g,r-1,c); dfs(g,r,c+1); dfs(g,r,c-1);
  }
}`,
    py: `def num_islands(g):
    m,n=len(g),len(g[0]); cnt=0
    def dfs(r,c):
        if r<0 or c<0 or r>=m or c>=n or g[r][c]=='0': return
        g[r][c]='0'
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
    for i in range(m):
        for j in range(n):
            if g[i][j]=='1':
                cnt+=1; dfs(i,j)
    return cnt`
  },

  "Course Schedule": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
bool canFinish(int n, vector<vector<int>>&e){
  vector<int> indeg(n); vector<vector<int>> g(n);
  for(auto &v:e){ g[v[1]].push_back(v[0]); indeg[v[0]]++; }
  queue<int>q; for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);
  int cnt=0;
  while(!q.empty()){
    int u=q.front(); q.pop(); cnt++;
    for(int v:g[u]) if(--indeg[v]==0) q.push(v);
  }
  return cnt==n;
}`,
    java: `import java.util.*;
class Sol{
  boolean canFinish(int n,int[][]e){
    int[] indeg=new int[n];
    List<List<Integer>> g=new ArrayList<>();
    for(int i=0;i<n;i++) g.add(new ArrayList<>());
    for(int[]v:e){ g.get(v[1]).add(v[0]); indeg[v[0]]++; }
    Queue<Integer>q=new ArrayDeque<>();
    for(int i=0;i<n;i++) if(indeg[i]==0) q.add(i);
    int cnt=0;
    while(!q.isEmpty()){
      int u=q.poll(); cnt++;
      for(int v:g.get(u)) if(--indeg[v]==0) q.add(v);
    }
    return cnt==n;
  }
}`,
    py: `def can_finish(n,edges):
    from collections import deque,defaultdict
    g=defaultdict(list); indeg=[0]*n
    for u,v in edges:
        g[v].append(u); indeg[u]+=1
    q=deque(i for i in range(n) if indeg[i]==0)
    cnt=0
    while q:
        u=q.popleft(); cnt+=1
        for v in g[u]:
            indeg[v]-=1
            if indeg[v]==0: q.append(v)
    return cnt==n`
  },

  "Dijkstra Shortest Path": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<long long> dijkstra(int n, vector<vector<pair<int,int>>>&g, int src){
  vector<long long> d(n,1e18);
  priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>> pq;
  d[src]=0; pq.push({0,src});
  while(!pq.empty()){
    auto [dist,u]=pq.top(); pq.pop();
    if(dist!=d[u]) continue;
    for(auto &e:g[u]){
      int v=e.first, w=e.second;
      if(d[v]>dist+w){
        d[v]=dist+w; pq.push({d[v],v});
      }
    }
  }
  return d;
}`,
    java: `import java.util.*;
class Sol{
  long[] dijkstra(int n,List<List<int[]>>> g,int src){
    long[] d=new long[n]; Arrays.fill(d,(long)1e18);
    PriorityQueue<long[]>pq=new PriorityQueue<>((a,b)->Long.compare(a[0],b[0]));
    d[src]=0; pq.add(new long[]{0,src});
    while(!pq.isEmpty()){
      long[] cur=pq.poll(); long dist=cur[0]; int u=(int)cur[1];
      if(dist!=d[u]) continue;
      for(int[]e:g.get(u)){
        int v=e[0], w=e[1];
        if(d[v]>dist+w){
          d[v]=dist+w; pq.add(new long[]{d[v],v});
        }
      }
    }
    return d;
  }
}`,
    py: `def dijkstra(n,g,src):
    import heapq
    d=[10**18]*n; d[src]=0
    pq=[(0,src)]
    while pq:
        dist,u=heapq.heappop(pq)
        if dist!=d[u]: continue
        for v,w in g[u]:
            if d[v]>dist+w:
                d[v]=dist+w
                heapq.heappush(pq,(d[v],v))
    return d`
  },

  "Shortest Path in Matrix": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int shortest(vector<vector<int>>&g){
  int n=g.size(); if(!n||g[0][0]||g[n-1][n-1]) return -1;
  vector<vector<int>> d(n,vector<int>(n,1e9));
  queue<pair<int,int>>q; d[0][0]=1; q.push({0,0});
  int dr[8]={1,-1,0,0,1,1,-1,-1}; int dc[8]={0,0,1,-1,1,-1,1,-1};
  while(!q.empty()){
    auto [r,c]=q.front(); q.pop();
    if(r==n-1 && c==n-1) return d[r][c];
    for(int k=0;k<8;k++){
      int nr=r+dr[k], nc=c+dc[k];
      if(nr>=0&&nc>=0&&nr<n&&nc<n && !g[nr][nc] && d[nr][nc]>d[r][c]+1){
        d[nr][nc]=d[r][c]+1;
        q.push({nr,nc});
      }
    }
  }
  return -1;
}`,
    java: `import java.util.*;
class Sol{
  int shortest(int[][]g){
    int n=g.length; if(n==0||g[0][0]==1||g[n-1][n-1]==1) return -1;
    int[][] d=new int[n][n];
    for(int[]r:d) Arrays.fill(r,(int)1e9);
    int[]dr={1,-1,0,0,1,1,-1,-1}, dc={0,0,1,-1,1,-1,1,-1};
    Queue<int[]>q=new ArrayDeque<>(); d[0][0]=1; q.add(new int[]{0,0});
    while(!q.isEmpty()){
      int[]p=q.poll(); int r=p[0],c=p[1];
      if(r==n-1 && c==n-1) return d[r][c];
      for(int k=0;k<8;k++){
        int nr=r+dr[k],nc=c+dc[k];
        if(nr>=0&&nc>=0&&nr<n&&nc<n && g[nr][nc]==0 && d[nr][nc]>d[r][c]+1){
          d[nr][nc]=d[r][c]+1; q.add(new int[]{nr,nc});
        }
      }
    }
    return -1;
  }
}`,
    py: `def shortest_path_mat(g):
    from collections import deque
    n=len(g)
    if not n or g[0][0] or g[n-1][n-1]: return -1
    d=[[10**9]*n for _ in range(n)]
    q=deque([(0,0)]); d[0][0]=1
    dirs=[(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)]
    while q:
        r,c=q.popleft()
        if r==n-1 and c==n-1: return d[r][c]
        for dr,dc in dirs:
            nr,nc=r+dr,c+dc
            if 0<=nr<n and 0<=nc<n and not g[nr][nc] and d[nr][nc]>d[r][c]+1:
                d[nr][nc]=d[r][c]+1; q.append((nr,nc))
    return -1`
  },

  "Clone Graph": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
struct Node{ int val; vector<Node*> nei; };
Node* clone(Node* u){
  if(!u) return u;
  unordered_map<Node*,Node*> mp;
  queue<Node*>q; q.push(u);
  mp[u]=new Node{u->val,{}};
  while(!q.empty()){
    auto c=q.front(); q.pop();
    for(auto x:c->nei){
      if(!mp.count(x)){
        mp[x]=new Node{x->val,{}};
        q.push(x);
      }
      mp[c]->nei.push_back(mp[x]);
    }
  }
  return mp[u];
}`,
    java: `import java.util.*;
class Node{ int val; List<Node> nei; }
class Sol{
  Node clone(Node u){
    if(u==null) return null;
    Map<Node,Node> mp=new HashMap<>();
    Queue<Node> q=new ArrayDeque<>();
    q.add(u); mp.put(u,new Node());
    mp.get(u).val=u.val; mp.get(u).nei=new ArrayList<>();
    while(!q.isEmpty()){
      Node c=q.poll();
      for(Node x:c.nei){
        if(!mp.containsKey(x)){
          Node t=new Node(); t.val=x.val; t.nei=new ArrayList<>();
          mp.put(x,t); q.add(x);
        }
        mp.get(c).nei.add(mp.get(x));
      }
    }
    return mp.get(u);
  }
}`,
    py: `class Node:
    def __init__(self,val=0,nei=None):
        self.val=val; self.nei=nei if nei else []

def clone_graph(u):
    if not u: return u
    from collections import deque
    mp={u:Node(u.val)}; q=deque([u])
    while q:
        c=q.popleft()
        for x in c.nei:
            if x not in mp:
                mp[x]=Node(x.val); q.append(x)
            mp[c].nei.append(mp[x])
    return mp[u]`
  },


  // ========== DYNAMIC PROGRAMMING (5) ==========
  "Coin Change 1": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int coinChange(vector<int>&c,int t){
  vector<int> dp(t+1,1e9); dp[0]=0;
  for(int x:c) for(int i=x;i<=t;i++)
    dp[i]=min(dp[i],dp[i-x]+1);
  return dp[t]>=1e9?-1:dp[t];
}`,
    java: `import java.util.*;
class Sol {
  int coinChange(int[]c,int t){
    int[] dp=new int[t+1]; Arrays.fill(dp,(int)1e9); dp[0]=0;
    for(int x:c) for(int i=x;i<=t;i++)
      dp[i]=Math.min(dp[i],dp[i-x]+1);
    return dp[t]>=1e9?-1:dp[t];
  }
}`,
    py: `def coin_change(c,t):
    dp=[10**9]*(t+1); dp[0]=0
    for x in c:
        for i in range(x,t+1):
            dp[i]=min(dp[i],dp[i-x]+1)
    return -1 if dp[t]>=10**9 else dp[t]`
  },

  "House Robber": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int rob(vector<int>&a){
  int p=0, c=0;
  for(int x:a){
    int np = max(c, p + x);
    p = c; c = np;
  }
  return c;
}`,
    java: `class Sol{
  int rob(int[]a){
    int p=0,c=0;
    for(int x:a){
      int np=Math.max(c, p+x);
      p=c; c=np;
    }
    return c;
  }
}`,
    py: `def rob(a):
    p=c=0
    for x in a:
        p,c=c,max(c,p+x)
    return c`
  },

  "Longest Increasing Subsequence": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int LIS(vector<int>&a){
  vector<int> d;
  for(int x:a){
    auto it=lower_bound(d.begin(),d.end(),x);
    if(it==d.end()) d.push_back(x);
    else *it=x;
  }
  return d.size();
}`,
    java: `import java.util.*;
class Sol{
  int LIS(int[]a){
    List<Integer> d=new ArrayList<>();
    for(int x:a){
      int i=Collections.binarySearch(d,x);
      if(i<0) i=~i;
      if(i==d.size()) d.add(x);
      else d.set(i,x);
    }
    return d.size();
  }
}`,
    py: `def lis(a):
    import bisect
    d=[]
    for x in a:
        i=bisect.bisect_left(d,x)
        if i==len(d): d.append(x)
        else: d[i]=x
    return len(d)`
  },

  "Partition Equal Subset Sum": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
bool can(vector<int>&a){
  int s=accumulate(a.begin(),a.end(),0);
  if(s%2) return false;
  int t=s/2; vector<char> dp(t+1,0); dp[0]=1;
  for(int x:a) for(int i=t;i>=x;i--) dp[i]|=dp[i-x];
  return dp[t];
}`,
    java: `import java.util.*;
class Sol{
  boolean can(int[]a){
    int s=0; for(int x:a) s+=x;
    if((s&1)==1) return false;
    int t=s/2; boolean[]dp=new boolean[t+1]; dp[0]=true;
    for(int x:a) for(int i=t;i>=x;i--) dp[i]|=dp[i-x];
    return dp[t];
  }
}`,
    py: `def can_partition(a):
    s=sum(a)
    if s%2: return False
    t=s//2; dp=[False]*(t+1); dp[0]=True
    for x in a:
        for i in range(t,x-1,-1):
            dp[i]=dp[i] or dp[i-x]
    return dp[t]`
  },

  "Edit Distance": {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int edit(string a,string b){
  int n=a.size(),m=b.size();
  vector<vector<int>> dp(n+1,vector<int>(m+1));
  for(int i=0;i<=n;i++) dp[i][0]=i;
  for(int j=0;j<=m;j++) dp[0][j]=j;
  for(int i=1;i<=n;i++)
    for(int j=1;j<=m;j++)
      dp[i][j]= (a[i-1]==b[j-1]?dp[i][j-1]: min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]})+1);
  return dp[n][m];
}`,
    java: `class Sol{
  int edit(String a,String b){
    int n=a.length(),m=b.length();
    int[][]dp=new int[n+1][m+1];
    for(int i=0;i<=n;i++) dp[i][0]=i;
    for(int j=0;j<=m;j++) dp[0][j]=j;
    for(int i=1;i<=n;i++)
      for(int j=1;j<=m;j++)
        dp[i][j]= (a.charAt(i-1)==b.charAt(j-1)?dp[i][j-1]: Math.min(Math.min(dp[i-1][j],dp[i][j-1]),dp[i-1][j-1])+1);
    return dp[n][m];
  }
}`,
    py: `def edit(a,b):
    n,m=len(a),len(b)
    dp=[[0]*(m+1) for _ in range(n+1)]
    for i in range(n+1): dp[i][0]=i
    for j in range(m+1): dp[0][j]=j
    for i in range(1,n+1):
        for j in range(1,m+1):
            if a[i-1]==b[j-1]:
                dp[i][j]=dp[i][j-1]
            else:
                dp[i][j]=min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])+1
    return dp[n][m]`
  },

}; // <-- Keep this closing brace. For Parts 2 & 3, open this file and insert their entries just ABOVE this line.

