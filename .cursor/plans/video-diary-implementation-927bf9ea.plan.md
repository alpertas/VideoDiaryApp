<!-- 927bf9ea-6bca-4af9-9bdf-132c49a78c59 3d0f9360-dc96-4cdf-81be-f8a20a4bab32 -->
# Video Diary App Implementation Plan

## Phase 1: Dependencies & Configuration

### Install Required Packages

```bash
npx expo install expo-sqlite expo-video expo-image-picker expo-file-system
npm install @tanstack/react-query zustand zod expo-trim-video
npm install nativewind tailwindcss@3.3.2
npm install @shopify/flash-list
npm install react-hook-form @hookform/resolvers
```

### Configure NativeWind

- Create `tailwind.config.js` with content paths for app/ and components/
- Update `babel.config.js` to include nativewind plugin
- Create `global.css` for Tailwind directives
- Update `app/_layout.tsx` to import global styles

### Update app.json

Add plugins for expo-image-picker, expo-video, and necessary permissions (camera, media library)

## Phase 2: Clean Slate Navigation Structure

### Remove Existing Structure

- Delete `app/(tabs)/` directory entirely
- Remove `app/modal.tsx`
- Clean up unnecessary components (hello-wave, parallax-scroll-view, etc.)

### Create New Routing Structure

```
app/
├── _layout.tsx          # Root layout with QueryClientProvider + Stack
├── index.tsx            # Main Screen (Video List)
├── add.tsx              # Add Video Modal (3-step wizard)
├── videos/
│   └── [id].tsx         # Video Details Page
└── edit/
    └── [id].tsx         # Edit Video Page
```

## Phase 3: Database Layer (SQLite Service)

### Create `lib/database.ts`

- Initialize SQLite database with `expo-sqlite`
- Define schema: `videos` table (id INTEGER PRIMARY KEY, uri TEXT, name TEXT, description TEXT, createdAt INTEGER)
- Export typed functions:
  - `initDatabase()`: Create table if not exists
  - `getAllVideos()`: Return Video[]
  - `getVideoById(id: number)`: Return Video | null
  - `insertVideo(data)`: Return inserted ID
  - `updateVideo(id, data)`: Return boolean
  - `deleteVideo(id)`: Return boolean

### Create TypeScript Types (`types/index.ts`)

```typescript
export interface Video {
  id: number;
  uri: string;
  thumbnailUri: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface VideoInput {
  uri: string;
  thumbnailUri: string;
  name: string;
  description: string;
}
```

### Create Validation Schema (`lib/validation.ts`)

```typescript
import { z } from 'zod';

export const videoMetadataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
```

## Phase 4: Tanstack Query Integration

### Create `lib/queries.ts`

Define query keys and hooks:

- `useVideosQuery()`: Fetches all videos via `useQuery`
- `useVideoQuery(id)`: Fetches single video
- `useAddVideoMutation()`: Wraps trimVideo + insertVideo
- `useUpdateVideoMutation()`: Updates video metadata
- `useDeleteVideoMutation()`: Deletes video

**CRITICAL:** The `useAddVideoMutation` must:

1. Call `trimVideo()` from expo-trim-video
2. On success, call `insertVideo()` to persist
3. Invalidate `['videos']` query key to refresh list

### Update `app/_layout.tsx`

- Import QueryClient, QueryClientProvider
- Initialize database in useEffect
- Wrap Stack.Navigator with QueryClientProvider

## Phase 5: Reusable Components

### Create `components/video/VideoPlayer.tsx`

- Use `expo-video` with `useVideoPlayer` hook
- Accept uri prop
- Add play/pause controls
- Style with NativeWind

### Create `components/video/VideoListItem.tsx`

- Display video thumbnail using standard `<Image />` component (expo-image) from `thumbnailUri`
- **CRITICAL:** DO NOT use expo-video inside list items (performance)
- Show name, description, date
- Accept onPress callback
- Style with NativeWind classes (card layout)

### Create `components/video/VideoTrimmer.tsx`

- Display video player with timeline
- Use Reanimated for draggable start/end handles
- Show visual indicators for 5-second segment
- Emit `onTrimChange(startTime, endTime)` callback
- Constraint: endTime - startTime = 5 seconds

### Create `components/ui/Button.tsx`

- Reusable button with NativeWind variants (primary, secondary, danger)
- Loading state support

## Phase 6: Add Video Wizard (`app/add.tsx`)

### State Management

Use local state (useState) for:

- `currentStep` (1, 2, or 3)
- `selectedVideo` (ImagePickerAsset | null)
- `trimRange` ({ start: number, end: number })
- `metadata` ({ name: string, description: string })

### Step 1: Video Selection

- Use `expo-image-picker` with `launchImageLibraryAsync`
- MediaTypeOptions: Videos only
- Validation: Check duration >= 5 seconds using expo-video
- Show error if too short
- Button: "Next" → Step 2

### Step 2: Video Trimming

- Render `VideoTrimmer` component
- Initialize with video from Step 1
- Allow user to drag handles to select 5-second segment
- Button: "Next" → Step 3

### Step 3: Metadata Form

- Use `react-hook-form` + Zod validation
- Text input for "Name" (required)
- TextArea for "Description" (optional)
- Button: "Save" → Trigger mutation

### Mutation Logic

```typescript
const mutation = useAddVideoMutation();

const handleSave = async (formData) => {
  mutation.mutate({
    sourceUri: selectedVideo.uri,
    startTime: trimRange.start,
    endTime: trimRange.end,
    metadata: formData,
  });
};
```

On success: Navigate back to index with `router.back()`

### UI/UX

- Present as modal (Stack.Screen with presentation="modal")
- Show step indicator (1/3, 2/3, 3/3)
- "Back" button for Steps 2 & 3
- Loading state during mutation

## Phase 7: Main Screen (`app/index.tsx`)

### Data Fetching

- Use `useVideosQuery()` hook
- Show loading spinner while loading
- Handle empty state with friendly message

### List Rendering

- Use `@shopify/flash-list` for optimal performance
- renderItem: `VideoListItem` component
- estimatedItemSize: 120
- onPress: Navigate to `videos/[id]`

### Swipe Actions

- Use `react-native-gesture-handler` (Swipeable)
- Right swipe: "Delete" button (red, danger variant)
  - Trigger `useDeleteVideoMutation`
- Left swipe: "Edit" button (blue, primary variant)
  - Navigate to `edit/[id]`

### Layout Animation

- Use `LayoutAnimation` from Reanimated when items added/removed
- Configure in mutation callbacks (onSuccess)

### Header

- Title: "Video Diary"
- Right button: "+" → Navigate to `add`

### Styling

- NativeWind classes for padding, spacing, background
- Dark mode support via `useColorScheme()`

## Phase 8: Details Page (`app/videos/[id].tsx`)

### Data Fetching

- Get id from `useLocalSearchParams()`
- Use `useVideoQuery(id)`
- Show loading state

### Layout

- Full-screen VideoPlayer at top
- Below: Name (large, bold), Description, Date
- Action buttons: "Edit" → Navigate to edit/[id]

### Styling

- SafeAreaView with NativeWind
- Proper spacing and typography

## Phase 9: Edit Page (`app/edit/[id].tsx`)

### Data Fetching

- Get id from params
- Use `useVideoQuery(id)` to prefill form

### Form

- Similar to Add wizard Step 3
- react-hook-form with Zod validation
- Prefill with existing name/description

### Mutation

- Use `useUpdateVideoMutation()`
- On success: Navigate back with `router.back()`

### UI

- Present as modal
- "Cancel" and "Save" buttons
- Loading state during update

## Phase 10: State Management (Zustand)

### Create `store/ui-store.ts`

- Optional: For non-persistent UI state like theme preference
- Example: `useUIStore()` with `isDarkMode`, `toggleDarkMode()`

This is minimal since most state is in SQLite + Tanstack Query

## Phase 11: Polish & Error Handling

### Error Boundaries

- Wrap screens in ErrorBoundary (Expo Router supports this)
- Show friendly error messages

### Loading States

- Consistent loading spinners across all screens
- Skeleton loaders for list items (optional)

### Permissions Handling

- Check camera/media library permissions before picker
- Show permission denied UI with instructions

### Toast/Snackbar

- Success messages after add/edit/delete
- Use simple Alert for now or add react-native-toast-message

### TypeScript Strictness

- Ensure no `any` types
- Strict mode enabled in tsconfig.json
- Proper typing for all components, hooks, mutations

## File Structure Summary

```
app/
├── _layout.tsx
├── index.tsx
├── add.tsx
├── videos/[id].tsx
└── edit/[id].tsx

components/
├── video/
│   ├── VideoPlayer.tsx
│   ├── VideoListItem.tsx
│   └── VideoTrimmer.tsx
└── ui/
    └── Button.tsx

lib/
├── database.ts
├── queries.ts
└── validation.ts

store/
└── ui-store.ts

types/
└── index.ts
```

## Key Technical Notes

1. **Tanstack Query Mutation for trimVideo**: The core requirement is that `trimVideo()` from `expo-trim-video` must be called inside a `useMutation` callback, not directly in an event handler. This ensures proper loading states, error handling, and cache invalidation.

2. **SQLite over AsyncStorage**: All video metadata is persisted in SQLite, not AsyncStorage, for better queryability and scalability.

3. **NativeWind over StyleSheet**: Use Tailwind classes (`className="..."`) for all styling. Only use StyleSheet.create for Reanimated animated values if absolutely necessary.

4. **Video Duration Validation**: In the picker, immediately check if video.duration >= 5000ms. Reject and show error if shorter.

5. **FlashList Performance**: Use `estimatedItemSize` prop for optimal performance. Avoid inline functions in renderItem.

6. **Reanimated Scrubber**: The VideoTrimmer component uses `useSharedValue` and `useAnimatedGestureHandler` for smooth dragging of trim handles.

### To-dos

- [ ] Install all required packages and dependencies
- [ ] Configure NativeWind with tailwind.config.js and babel.config.js
- [ ] Update app.json with required plugins and permissions
- [ ] Update app/_layout.tsx with global styles import