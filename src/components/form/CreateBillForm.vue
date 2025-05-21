<script setup></script>

<template>
  <div>
    <Dialog>
      <DialogTrigger>
        <Button class="bg-orange-500 w-48 rounded-xs">Create bill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new bill</DialogTitle>
          <DialogDescription> Fill in the details to create a new bill. </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter title"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="amount">
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="dueDate">
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" v-bind="componentField" class="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="mt-4 w-full bg-orange-500"> Create Bill </Button>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
