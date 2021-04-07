TITLE Low-level I/O procedures    (template.asm)

; Author: Patrick Daniels
; Last Modified: 6/7/20
; OSU email address: danielpa@oregonstate.edu
; Course number/section: CS271-400
; Project Number: 6                Due Date: 6/7/20
; Description: Program takes a list of signed numbers entered one at a time by user. Converts them to integers and adds
; them to an array. It then converts each number back to a string and displays the array of entered values as well as
; the sum and average of the array.

INCLUDE Irvine32.inc

STRINGSIZE = 13
ARRAYSIZE = 10





;----------------------------------------------------------------
mGetString		MACRO		prompt:req, buffer:req , stringSize:req
;
; prompts user for input and reads string to buffer
;
; preconditions: stringSize <= size of buffer
;
; receives:
; prompt = address of prompt text
; buffer = address of buffer to fill 
; stringSize = size of buffer
;
; returns: inputted string in buffer
;----------------------------------------------------------------

	push 		edx
	push 		ecx
	push		ebx
	mov			edx, prompt
	call		WriteString
	mov			edx, buffer
	mov			ebx, [edx]
	mov			ecx, stringSize - 1
	call		ReadString
	pop			ebx
	pop 		ecx
	pop			edx
ENDM

;----------------------------------------------------------------
mDisplayString	MACRO		string:req
;
; Displays a string to console window
;
; preconditions: none
;
; receives:
; string = string to display
;
; returns: writes string to console window
;----------------------------------------------------------------
	
	push		edx
	mov			edx,string
	call		WriteString
	pop			edx
ENDM
	

.data

info			BYTE		"Low_Level I/O Procedures			Programmed by Patrick Daniels",0
instruct		BYTE		"Please Provide 10 signed decimal integers.",0
instruct2		BYTE		"Each number needs to be small enough to fit inside a 32 bit register.",0
instruct3		BYTE		"After you have finished inputing the raw numbers I will display a list ",0
instruct4		BYTE		"of the integers, their sum, and their average value.",0
prompt			BYTE		"Please enter a signed number: ", 0
error			BYTE		"ERROR: Entered value not a signed number or too big!",0
youEntered		BYTE		"You entered the following numbers: ",0
sumTxt			BYTE		"The sum of these numbers is: ",0
avgTxt			BYTE		"The rounded average of these nums is: ",0
bye				BYTE		"That's all, goodbye.",0

stringBuffer	BYTE		STRINGSIZE DUP(?)
revBuffer		BYTE		STRINGSIZE DUP(?)
numArray		DWORD		ARRAYSIZE DUP(?)	
numBuffer		DWORD		?
sumBuffer		DWORD		?
avgBuffer		DWORD		?

.code
main PROC

	; intro
	push 		OFFSET info
	push		OFFSET instruct
	push		OFFSET instruct2
	push 		OFFSET instruct3
	push		OFFSET instruct4
	call 		intro
	

	; get and read values
	push		OFFSET numArray
	push		ARRAYSIZE
	push		OFFSET error
	push		OFFSET prompt
	push		OFFSET stringBuffer
	push		OFFSET numBuffer
	push		STRINGSIZE
	call		getNums
	call		CrLf
	
	; Display number array
	push		OFFSET youEntered
	push		OFFSET numArray
	push		OFFSET stringBuffer
	push		OFFSET	revBuffer
	push		ARRAYSIZE
	call		DisplayArray
	call		CrLf
	call		CrLf
	
	; Find Sum
	push		OFFSET	numArray
	push		OFFSET 	sumBuffer
	push		ARRAYSIZE
	call		SumArray
	
	; Display sum
	mDisplayString	OFFSET sumTxt
	push			OFFSET stringBuffer
	push			OFFSET revBuffer
	push			sumBuffer
	call			WriteVal
	call			CrLf
	call			CrLf
	
	; Find Average
	push		sumBuffer
	push		OFFSET avgBuffer
	push		ARRAYSIZE
	call		FindAvg
	
	; Display Average
	mDisplayString	OFFSET avgTxt
	push			OFFSET stringBuffer
	push			OFFSET revBuffer
	push			avgBuffer
	call			WriteVal
	call			CrLf
	call		CrLf
	
	; Say Goodbye
	mDisplayString	OFFSET	bye
	call			Crlf
	
	

	

	

	exit	; exit to operating system
main ENDP

intro	PROC

; ***************************************************************
; Procedure to inroduce the program and programmer as well as describe the function of the program
; receives: addresses of info, instruct - instruct4
; returns: writes info, instruct-instruct4 to console window
; preconditions: none
; registers changed: none
; ***************************************************************

	push 			ebp
	mov			 	ebp, esp
	mDisplayString	[ebp + 24]
	call			CrLf
	mDisplayString	[ebp + 20]
	call			CrLf
	mDisplayString	[ebp + 16]
	call			CrLf
	mDisplayString	[ebp + 12]
	call			CrLf
	mDisplayString	[ebp + 8]
	call			CrLf
	call			CrLf
	pop				ebp
	ret 20
	
intro ENDP
	

GetNums	PROC	

; ***************************************************************
; Procedure to get correct number of inputs as strings and call ReadVal to
; convert the strings to signed integers then add signed integers to numArray
; receives: addresses of numArray, error, prompt, stringBuffer, and numbuffer.
; 	Values of ARRAYSIZE and STRINGSIZE
; returns: numArray as arrat of signed integers entered by user
; preconditions: ARRAYSIZE = size of numArray, STRINGSIZE <= size of stringBuffer
; registers changed: none
; ***************************************************************

	push		ebp
	mov			ebp, esp
	pushad
	
	; get and read values
	mov			edi, [ebp + 32]		; @numArray
	mov			ecx, [ebp + 28]		; ARRAYSIZE		
	cld
	
readLoop:

	push		[ebp + 24]			; @error
	push		[ebp + 20]			; @prompt
	push		[ebp + 16]			; @stringBuffer
	push		[ebp + 12]			; @numBuffer
	push		[ebp + 8]			; STRINGSIZE
	call 		ReadVal
	mov			ebx, [ebp + 12]		; ebx = @numBuffer
	mov			eax, [ebx]			; eax = numBuffer
	stosd
	loop		readLoop
	popad
	pop			ebp
	ret	28
	
GetNums ENDP
	
	
ReadVal PROC

; ***************************************************************
; Procedure to get a string from user and convert it to a signed integer
; receives: Addresses of prompt and stringBuffer. Value of STRINGSIZE
; returns: signed integer form of string from stringBuffer in numBuffer or error
; 	if num is invalid
; preconditions: ARRAYSIZE = size of numArray, STRINGSIZE <= size of stringBuffer
; registers changed: none
; ***************************************************************

	push		ebp
	mov			ebp, esp
	pushad
	mov			edi, 10			; multiplier
	mov			ebx, 0
	or			eax, 0

Input:
				; @prompt,@stringBuffer,STRINGSIZE
	mGetString	[ebp + 20], [ebp + 16], [ebp + 8]
	
	; check if no entry or just sign entered
	cmp		eax, 0
	je		InvalidNum
	cmp		eax, 1
	je		OneDigit
	
	; check sign
	cld
	mov 	esi, [ebp + 16]
	lodsb	
	cmp		al, 45			; -
	je		Minus
	cmp		al, 43			; +
	je		Plus
	jmp		PosNum
		

Plus:

	; move past sign
	lodsb
	jmp		PosNum
	
OneDigit:

	; check if just sign entered
	cld
	mov		esi, [ebp + 16]
	lodsb
	cmp		al, 45			; -
	je		InvalidNum
	cmp		al, 43			; +
	je		InvalidNum
	
PosNum:
	
	cmp		al, 0
	je		moveToBuff		; end loop
	
	; check if char is a digit
	cmp		al, 48
	jl		InvalidNum
	cmp		al, 57
	jg		InvalidNum
	
	; convert to decimal
	sub		eax, 48
	mov		ecx, eax
	mov		eax, ebx
	mul		edi
	mov		ebx, eax
	
	; check if too large
	jo		invalidNum
	add		ebx, ecx
	jo		invalidNum
	mov		eax, 0
	lodsb
	jmp		PosNum
		
Minus:

	lodsb
	
NegNum:

	cmp		al, 0
	je		moveToBuff		; end loop
	
	; check if char is digit
	cmp		al, 48
	jl		InvalidNum
	cmp		al, 57
	jg		InvalidNum
	sub		eax, 48
	
	; convert to decimal
	neg		eax
	mov		ecx, eax
	mov		eax, ebx
	imul	edi
	mov		ebx, eax
	
	; check if too large
	jo		invalidNum
	add		ebx, ecx
	jo		InvalidNum
	mov		eax, 0
	lodsb
	jmp		NegNum

InvalidNum:

	mDisplayString	[ebp + 24]
	call			CrLf
	or 				eax, 0			; clear overflow flag
	mov				ebx, 0			
	jmp				Input

moveToBuff:

	mov		edi, [ebp + 12]			; @numBuffer
	mov		[edi], ebx

EndRead:
	
	popad
	pop			ebp
	ret			20

ReadVal ENDP


DisplayArray PROC


; ***************************************************************
; Procedure to get a string from user and convert it to a signed integer
; receives: Addresses of prompt and stringBuffer. Value of STRINGSIZE
; returns: signed integer form of string from stringBuffer in numBuffer
; preconditions: ARRAYSIZE = size of numArray, STRINGSIZE <= size of stringBuffer
; registers changed: none
; ***************************************************************

	push			ebp
	mov				ebp, esp
	pushad		
	mDisplayString 	[ebp + 24]			; @youEntered
	
	mov				ecx, [ebp + 8]		; ARRAYSIZE
	mov				esi, [ebp + 20]		; @numArray
	cld

WriteLoop:
	
	lodsd

	push		[ebp + 16]			; @stringBuffer
	push		[ebp + 12]			; @revBuffer
	push		eax					; num to convert
	call		WriteVal
	cmp			ecx, 1
	jg			Comma

Break: 

	loop		WriteLoop
	jmp			EndDisplay

Comma: 

	mov			al, 44
	call		WriteChar
	mov			al, 32
	call		WriteChar
	jmp			Break
	

EndDisplay:

	popad
	pop 		ebp
	ret 20

DisplayArray ENDP

; ***************************************************************
; Procedure to convert a numeric value to a string and write it to the console window.
; receives: Addresses of stringBuffer and revBuffer. Value of number to convert
; returns: writes value in string form to console window
; preconditions: none
; registers changed: none
; ***************************************************************


WriteVal PROC

	push		ebp
	mov			ebp, esp
	pushad
	mov			edi, [ebp + 16] 	; @stringBuffer 
	mov			eax, [ebp + 8]		; num to convert
	mov			esi, 10				; divisor
	mov			ebx, eax			; save num
	cld
	cmp			eax, 0
	jge			ToString
	neg			eax					; make positive
	

ToString:

	cmp			eax, 0
	je			AddSign				; add sign to end of array
	
	; convert num to char
	mov			edx, 0
	div			esi
	mov			ecx, eax
	mov			eax, edx
	add			eax, 48
	
	; store in stringBuffer
	stosb
	mov			eax, ecx
	jmp			ToString
	
AddSign:

	cmp			ebx, 0				; ebx = original num
	jl			WriteMinus
	je			IsZero
	mov			al, 43
	stosb
	jmp			FindEnd
	
WriteMinus:

	mov			al, 45
	stosb
	
FindEnd:	

	mov			esi, edi	; @ stringBuffer
	dec			esi
	cld
	mov			edi, [ebp + 12]		; @revBuffer

	
Reverse:
	
	; from demo 6
	std			
	lodsb
	cld
	stosb
	cmp		eax, 0
	je		EndWrite
	jmp		Reverse
	
IsZero:

	mov		edi, [ebp + 12]		; @revBuffer
	cld
	mov		al, 48				; 0
	stosb
	mov		al, 0
	stosb
	
EndWrite:

	mDisplayString	[ebp + 12]
	popad
	pop				ebp
	ret 12
	
	
WriteVal ENDP


SumArray PROC

; ***************************************************************
; Procedure to sum the values of an array
; receives: Addresses of numArrayand sumBuffer. Value of ARRAYSIZE.
; returns: sum of values of array in sumBuffer
; preconditions: ARRAYSIZE = size of numArray
; Registers Changed: none
; ***************************************************************


	push		ebp
	mov			ebp, esp
	pushad		
	
	mov			ecx, [ebp + 8]		; ARRAYSIZE
	mov			esi, [ebp + 16]		; @numArray
	mov			ebx, 0
	mov			eax, 0
	cld
	
AddLoop:

	lodsd
	add			ebx, eax
	loop		AddLoop
	mov			edx, [ebp + 12]			; @sumBuffer
	mov			[edx], ebx
	popad
	pop			ebp
	ret	12
	
SumArray ENDP

FindAvg PROC

; ***************************************************************
; Procedure to get the average of the values of an array
; receives: Address of avgBuffer. Values of sumBuffer and ARRAYSIZE
; returns: average of values of array in avgBuffer
; preconditions: ARRAYSIZE >= 0
; registers changed: none
; ***************************************************************


	push		ebp
	mov			ebp, esp
	pushad

	; divide sumBuffer by ARRAYSIZE 
	mov			edx, 0
	mov			eax, [ebp + 16]			; sumBuffer
	mov			ebx, [ebp + 8]			; ARRAYSIZE
	cdq
	idiv		ebx
	
	; move to avgBuffer
	mov			ebx, [ebp + 12]			; @avgBuffer
	mov			[ebx], eax
	
	popad
	pop 		ebp
	ret 12
	
FindAvg	ENDP


END main
