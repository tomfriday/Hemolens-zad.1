# Hemolens-zad.1
zad.1 Napisać testy w playwright do dostarczonej aplikacji todo-app-template

Na początku otagowałem elementy po stronie frontu data-testid

Przypadki Testowe
1. Dodawanie Zadań (addTodo)
W tej sekcji testów sprawdzam dodawanie zadań o różnym typie i ich wyświetlanie na liście.

Dodanie zadania z długą nazwą: Sprawdza widoczność zadania z długim tytułem na liście.

Dodanie zadania z krótką nazwą: Sprawdza widoczność zadania z krótkim tytułem.

Dodanie zadania ze znakami specjalnymi: Sprawdza widoczność zadania zawierającego specjalne znaki.

Dodanie zadania z nazwą numeryczną: Sprawdza widoczność zadania z tytułem składającym się z liczb.

Dodanie wielu zadań i sprawdzenie kolejności: Dodaje kilka zadań i weryfikuje, że są wyświetlane w odpowiedniej kolejności.

Dodanie tego samego zadania dwukrotnie: Dodaje to samo zadanie dwa razy i sprawdza, że oba są widoczne na liście.

Dodanie normalnych zadań i weryfikacja widoczności: Dodaje zadania z określonej kategorii i weryfikuje ich widoczność oraz kolejność.

2. Oznaczanie Zadania Jako Ukończone (completeTodo)
   
W tej sekcji testów weryfikuje funkcjonalność oznaczania zadań jako ukończonych.

Oznaczenie pojedynczego zadania jako ukończone: Sprawdza, czy zadanie zostało oznaczone jako ukończone.

Oznaczenie wielu zadań jako ukończone: Sprawdza, że każde zadanie z listy jest oznaczone poprawnie.

Oznaczenie i odznaczenie zadania: Wielokrotnie oznacza i odznacza zadanie, a następnie sprawdza jego finalny status.

Oznaczenie zadań jako ukończone i weryfikacja po przeładowaniu strony: Sprawdza, czy stan zadań jest zachowany po przeładowaniu strony.

Dodanie ukończonego zadania przez API i weryfikacja: Dodaje zadanie oznaczone jako ukończone przez API, a następnie weryfikuje jego status na liście oraz odznacza je jako nieukończone.

3. Usuwanie Zadań (deleteTodo)
   
Testy w tej sekcji sprawdzajam usuwanie zadań.

Usunięcie ukończonego zadania: Sprawdza, czy zadanie oznaczone jako ukończone zostało poprawnie usunięte.

Usunięcie zadania nieukończonego: Sprawdza, czy nieukończone zadanie zostało usunięte.

Usunięcie wielu zadań z mieszanym statusem ukończenia: Losowo oznacza zadania jako ukończone lub nieukończone i sprawdza ich usunięcie.

Usunięcie zadania i weryfikacja po przeładowaniu strony: Sprawdza, czy zadanie nie pojawia się ponownie po przeładowaniu strony.

Usunięcie zadania i weryfikacja usunięcia przez API: Sprawdza, że usunięte zadanie nie jest dostępne w bazie danych po wywołaniu API.

4. Testy API (ApiTests)
   
Przypadki testowe w tej sekcji są wykonane wyłącznie przy użyciu żądań API

Dodanie nowego zadania przez API: Sprawdza, czy dodane zadanie istnieje.

Oznaczenie zadania jako ukończone przez API: Oznacza zadanie jako ukończone i sprawdza jego status.

Usunięcie zadania przez API: Usuwa zadanie i weryfikuje jego usunięcie.

Sekwencyjne dodanie, oznaczenie jako ukończone, a następnie usunięcie zadania przez API: Wykonuje kolejne kroki — dodanie, oznaczenie i usunięcie zadania — i weryfikuje status na każdym etapie.


Hooki

test.beforeEach

Przed każdym testem:

Oczyszcza endpoint z istniejących zadań za pomocą apiHelper.clearTodos. (prodcz testów API)

Dodaje zadania testowe za pomocą apiHelper.addTodo.

Sprawdza, czy zadania są widoczne na stronie ToDo poprzez weryfikację nagłówka.

test.afterAll

Po zakończeniu wszystkich testów:

Wywołuje apiHelper.clearTodos, aby usunąć wszystkie zadania.

Weryfikuje, że endpoint jest pusty po wyczyszczeniu, co zapewnia brak pozostawionych danych po testach


raport

aplikacja zawiera błąd, więc testy failed są oczekiwane

![image](https://github.com/user-attachments/assets/8f86788f-f968-4846-ba33-ad40479d4c27)

Podczas wywoływania testów czasami napotykam na błędy z połączeniem z serwerem http://localhost:5000/todos
aplikacja przestaje działać, ![image](https://github.com/user-attachments/assets/9977bb56-41ee-4d74-8a14-8ce5980b6874)

![image](https://github.com/user-attachments/assets/4eb144f2-0867-4e20-bd87-8f843ba6febc)

